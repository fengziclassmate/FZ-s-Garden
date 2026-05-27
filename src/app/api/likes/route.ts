import { NextResponse } from "next/server";
import { getSiteLikes, incrementSiteLikes, initDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 标记是否初始化过（单个实例生命周期内只跑一次）
let initialized = false;

async function ensureDb() {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
}

export async function GET() {
  await ensureDb();
  const count = await getSiteLikes();
  return NextResponse.json({ count });
}

export async function POST() {
  await ensureDb();
  const count = await incrementSiteLikes();
  return NextResponse.json({ count }, { status: 201 });
}
