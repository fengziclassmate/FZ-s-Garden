export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { setSessionCookie } from "@/lib/auth"

const SITE_URL = "https://fz-s-garden.vercel.app"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${SITE_URL}/behind?error=no_code`)
  }

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
        redirect_uri: `${SITE_URL}/api/auth/callback/github`,
      }),
    },
  )

  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token

  if (!accessToken) {
    return NextResponse.redirect(`${SITE_URL}/behind?error=token_failed`)
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const userData = await userRes.json()

  if (userData.login !== "fengziclassmate") {
    return NextResponse.redirect(`${SITE_URL}/behind?error=not_allowed`)
  }

  const res = NextResponse.redirect(`${SITE_URL}/behind/write`)
  await setSessionCookie()

  return res
}
