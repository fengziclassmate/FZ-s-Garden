export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { setSessionCookie } from "@/lib/auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/behind?error=no_code", request.url))
  }

  // 用 code 换 access_token
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3001"

  const tokenRes = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.AUTH_GITHUB_ID ?? "",
        client_secret: process.env.AUTH_GITHUB_SECRET ?? "",
        code,
        redirect_uri: `${base}/api/auth/github/callback`,
      }),
    },
  )

  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token

  if (!accessToken) {
    return NextResponse.redirect(
      new URL("/behind?error=token_failed", request.url),
    )
  }

  // 用 access_token 拿用户信息
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const userData = await userRes.json()

  // 只允许 fengziclassmate
  if (userData.login !== "fengziclassmate") {
    return NextResponse.redirect(
      new URL("/behind?error=not_allowed", request.url),
    )
  }

  const res = NextResponse.redirect(new URL("/behind/write", request.url))
  await setSessionCookie()

  return res
}
