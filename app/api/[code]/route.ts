import { sql } from "@/lib/db"

export const GET = async (req: Request, { params }: { params: { code: string } }) => {
  try {
    const { code } = params

    if (!code) {
      return Response.json({ error: "Code is required" }, { status: 400 })
    }

    // Get the link
    const links = await sql`SELECT * FROM links WHERE code = ${code}`

    if (links.length === 0) {
      return Response.json({ error: "Link not found" }, { status: 404 })
    }

    const link = links[0]

    // Ensure the URL has a protocol
    let redirectUrl = link.original_url
    if (!/^https?:\/\//i.test(redirectUrl)) {
      redirectUrl = 'https://' + redirectUrl
    }

    // Update click count and last_clicked timestamp
    await sql`UPDATE links SET click_count = click_count + 1, last_clicked = NOW() WHERE id = ${link.id}`

    // Return redirect response with 302 status
    return Response.redirect(redirectUrl, 302)
  } catch (error) {
    console.error("Redirect error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
