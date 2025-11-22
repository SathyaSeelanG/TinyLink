import { sql } from "@/lib/db"
import { isValidUrl, isValidCode, generateCode } from "@/lib/validation"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { getOrCreateUserId, createUserIdCookie } from "@/lib/cookies"

export const POST = async (req: Request) => {
  try {
    const body = await req.json()
    const { url, code } = body

    // Get or create user ID
    const userId = getOrCreateUserId(req)

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return errorResponse("Invalid URL format", 400)
    }

    let finalCode = code

    // If code provided, validate it
    if (finalCode) {
      if (!isValidCode(finalCode)) {
        return errorResponse("Code must be 6-8 alphanumeric characters", 400)
      }

      // Check if code already exists
      const existing = await sql`SELECT code FROM links WHERE code = ${finalCode}`
      if (existing.length > 0) {
        return errorResponse("Code already exists", 409)
      }
    } else {
      // Generate new code
      let attempts = 0
      while (attempts < 10) {
        finalCode = generateCode()
        const existing = await sql`SELECT code FROM links WHERE code = ${finalCode}`
        if (existing.length === 0) break
        attempts++
      }

      if (attempts === 10) {
        return errorResponse("Failed to generate unique code", 500)
      }
    }

    // Insert link with user_id
    const result = await sql`
      INSERT INTO links (code, original_url, created_at, click_count, user_id) 
      VALUES (${finalCode}, ${url}, NOW(), 0, ${userId}) 
      RETURNING *
    `

    // Create response with user ID cookie
    const response = successResponse(result[0], 201)
    response.headers.set("Set-Cookie", createUserIdCookie(userId))

    return response
  } catch (error) {
    console.error("POST /api/links error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export const GET = async (req: Request) => {
  try {
    // Get user ID from cookies
    const userId = getOrCreateUserId(req)

    // Filter links by user ID
    const links = await sql`
      SELECT * FROM links 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `

    // Create response with user ID cookie
    const response = successResponse(links)
    response.headers.set("Set-Cookie", createUserIdCookie(userId))

    return response
  } catch (error) {
    console.error("GET /api/links error:", error)
    return errorResponse("Internal server error", 500)
  }
}
