import { NextRequest, NextResponse } from "next/server";
import { getPostLikes, incrementPostLikes, initDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let initialized = false;

async function ensureDb() {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
}

export async function GET(req: NextRequest) {
  await ensureDb();
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug param" }, { status: 400 });
  }
  const count = await getPostLikes(slug);
  return NextResponse.json({ count });
}

export async function POST(req: NextRequest) {
  await ensureDb();
  const body = (await req.json()) as { slug?: string };
  const slug = body.slug;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug in body" }, { status: 400 });
  }
  const count = await incrementPostLikes(slug);
  return NextResponse.json({ count }, { status: 201 });
}
