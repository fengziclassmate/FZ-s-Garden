import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const likesFile = path.join(process.cwd(), "content", "likes.json");

type LikesData = {
  count?: unknown;
};

function normalizeCount(value: unknown) {
  const count = Number(value);
  return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
}

async function readLikes() {
  try {
    const source = await fs.readFile(likesFile, "utf8");
    const data = JSON.parse(source) as LikesData;
    return { count: normalizeCount(data.count) };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { count: 0 };
    }

    throw error;
  }
}

async function writeLikes(count: number) {
  await fs.mkdir(path.dirname(likesFile), { recursive: true });
  await fs.writeFile(
    likesFile,
    `${JSON.stringify({ count, updatedAt: new Date().toISOString() }, null, 2)}\n`,
    "utf8",
  );
}

export async function GET() {
  const data = await readLikes();
  return NextResponse.json(data);
}

export async function POST() {
  const current = await readLikes();
  const nextCount = current.count + 1;
  await writeLikes(nextCount);

  return NextResponse.json({ count: nextCount }, { status: 201 });
}
