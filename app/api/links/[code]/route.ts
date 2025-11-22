import { sql } from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { getOrCreateUserId } from "@/lib/cookies"

export const GET = async (req: Request, { params }: { params: Promise<{ code: string }> }) => {
  try {
    const { code } = await params
    const userId = getOrCreateUserId(req)

    // Get link and check ownership
    const links = await sql`
      SELECT * FROM links 
      WHERE code = ${code} AND user_id = ${userId}
    `

    if (links.length === 0) {
      return errorResponse("Link not found or you don't have permission to view it", 404)
    }

    return successResponse(links[0])
  } catch (error) {
    console.error("GET /api/links/[code] error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export const DELETE = async (req: Request, { params }: { params: Promise<{ code: string }> }) => {
  try {
    const { code } = await params
    const userId = getOrCreateUserId(req)

    // Delete only if the link belongs to the user
    const result = await sql`
      DELETE FROM links 
      WHERE code = ${code} AND user_id = ${userId} 
      RETURNING *
    `

    if (result.length === 0) {
      return errorResponse("Link not found or you don't have permission to delete it", 404)
    }

    return successResponse({ message: "Link deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/links/[code] error:", error)
    return errorResponse("Internal server error", 500)
  }
}
