import { cookies } from "next/headers"

// 一个简单的 token 生成
function generateToken(): string {
  const buf = new Uint8Array(32)
  crypto.getRandomValues(buf)
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

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
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearSession() {
  const cs = await cookies()
  cs.delete(TOKEN_COOKIE)
}

export function getAuthUrl(state: string): string {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3001"
  const redirectUri = `${base}/api/auth/github/callback`
  const clientId = process.env.AUTH_GITHUB_ID ?? ""
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=read:user`
}
