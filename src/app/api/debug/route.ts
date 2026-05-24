export const runtime = "nodejs"

import { NextResponse } from "next/server"

export async function GET() {
  const envCheck = {
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID ? `SET (length: ${process.env.AUTH_GITHUB_ID.length})` : "NOT SET",
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET ? `SET (length: ${process.env.AUTH_GITHUB_SECRET.length})` : "NOT SET",
    AUTH_SECRET: process.env.AUTH_SECRET ? `SET (length: ${process.env.AUTH_SECRET.length})` : "NOT SET",
    AUTH_URL: process.env.AUTH_URL ?? "NOT SET",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "NOT SET",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "NOT SET",
    VERCEL_URL: process.env.VERCEL_URL ?? "NOT SET",
    VERCEL_ENV: process.env.VERCEL_ENV ?? "NOT SET",
  }

  return NextResponse.json(envCheck)
}
