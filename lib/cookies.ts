import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

const USER_ID_COOKIE = "tinylink_user_id"
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds

/**
 * Generate a new user ID
 */
export function generateUserId(): string {
    return uuidv4()
}

/**
 * Get user ID from cookies (server-side)
 * Creates a new one if it doesn't exist
 */
export async function getUserIdFromCookies(): Promise<string> {
    const cookieStore = await cookies()
    let userId = cookieStore.get(USER_ID_COOKIE)?.value

    if (!userId) {
        userId = generateUserId()
    }

    return userId
}

/**
 * Create Set-Cookie header value for user ID
 */
export function createUserIdCookie(userId: string): string {
    return `${USER_ID_COOKIE}=${userId}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; HttpOnly`
}

/**
 * Get user ID from request cookies (for API routes)
 */
export function getUserIdFromRequest(request: Request): string | null {
    const cookieHeader = request.headers.get("cookie")
    if (!cookieHeader) return null

    const cookies = cookieHeader.split(";").map((c) => c.trim())
    const userIdCookie = cookies.find((c) => c.startsWith(`${USER_ID_COOKIE}=`))

    if (!userIdCookie) return null

    return userIdCookie.split("=")[1]
}

/**
 * Get user ID from request or generate new one
 */
export function getOrCreateUserId(request: Request): string {
    return getUserIdFromRequest(request) || generateUserId()
}
