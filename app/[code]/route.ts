import { sql } from "@/lib/db"
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { code: string } | Promise<{ code: string }> }
) {
  try {
    // Await the params if it's a Promise
    const resolvedParams = await Promise.resolve(params)
    const { code } = resolvedParams
    
    console.log('code', code)

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      )
    }

    // Rest of your code remains the same...
    const links = await sql`SELECT * FROM links WHERE code = ${code}`

    if (links.length === 0) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      )
    }

    const link = links[0]

    // Ensure the URL has a protocol
    let redirectUrl = link.original_url
    if (!/^https?:\/\//i.test(redirectUrl)) {
      redirectUrl = 'https://' + redirectUrl
    }

    // Update click count and last_clicked timestamp
    await sql`
      UPDATE links 
      SET click_count = click_count + 1, 
          last_clicked = NOW() 
      WHERE id = ${link.id}
    `

    // Return redirect response with 302 status
    return NextResponse.redirect(redirectUrl, 302)
  } catch (error) {
    console.error("Redirect error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}