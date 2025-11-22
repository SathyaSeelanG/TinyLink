import { NextResponse } from 'next/server'

export const GET = async () => {
    return NextResponse.json({ ok: true, version: "1.0" }, { status: 200 })
}
