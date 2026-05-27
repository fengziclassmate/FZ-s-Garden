import { NextRequest, NextResponse } from "next/server";
import { getPostLikes, incrementPostLikes } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug param" }, { status: 400 });
  }
  const count = await getPostLikes(slug);
  return NextResponse.json({ count });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { slug?: string };
  const slug = body.slug;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug in body" }, { status: 400 });
  }
  const count = await incrementPostLikes(slug);
  return NextResponse.json({ count }, { status: 201 });
}
