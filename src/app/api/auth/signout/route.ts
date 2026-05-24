export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { clearSession } from "@/lib/auth"

export async function POST() {
  const res = NextResponse.redirect(new URL("/behind", "https://fz-s-garden.vercel.app"))
  await clearSession()
  return res
}
