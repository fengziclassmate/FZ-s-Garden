export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getAuthUrl } from "@/lib/auth"

export async function GET() {
  const state = Math.random().toString(36).substring(2, 15)
  const url = getAuthUrl(state)

  const res = NextResponse.redirect(url)
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5,
  })

  return res
}
