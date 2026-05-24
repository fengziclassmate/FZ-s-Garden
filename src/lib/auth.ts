import { cookies } from "next/headers"

const TOKEN_COOKIE = "fz_auth_token"
const TOKEN_VALUE = "fengzi_authenticated"

export function getSession(): Promise<{ name: string } | null> {
  return cookies()
    .then((cs) => {
      const token = cs.get(TOKEN_COOKIE)
      if (token?.value === TOKEN_VALUE) {
        return { name: "fengziclassmate" }
      }
      return null
    })
    .catch(() => null)
}

export async function setSessionCookie() {
  const cs = await cookies()
  cs.set(TOKEN_COOKIE, TOKEN_VALUE, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSession() {
  const cs = await cookies()
  cs.delete(TOKEN_COOKIE)
}

export function getAuthUrl(state: string): string {
  const redirectUri = "https://fz-s-garden.vercel.app/api/auth/callback/github"
  const clientId = process.env.AUTH_GITHUB_ID ?? ""
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=read:user`
}
