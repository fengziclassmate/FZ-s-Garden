import { NextResponse } from "next/server";
import { getSiteLikes, incrementSiteLikes } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getSiteLikes();
  return NextResponse.json({ count });
}

export async function POST() {
  const count = await incrementSiteLikes();
  return NextResponse.json({ count }, { status: 201 });
}
