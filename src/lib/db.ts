import { createPool } from "@vercel/postgres";
import type { VercelPool } from "@vercel/postgres";
import type { ContentType } from "@/lib/types";

export type DbContentInput = {
  type: ContentType;
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  body: string;
  extra?: Record<string, unknown>;
  draft?: boolean;
  pinned?: boolean;
};

export type DbContentRow = DbContentInput & {
  created_at: Date;
  updated_at: Date;
};

let pool: VercelPool | null = null;
let initPromise: Promise<void> | null = null;

function getPool(): VercelPool {
  if (!pool) {
    pool = createPool({
      connectionString: process.env.POSTGRES_URL,
    });
  }
  return pool;
}

/**
 * 获取数据库客户端
 */
async function getClient() {
  return await getPool().connect();
}

/**
 * 初始化数据库表（幂等）
 */
async function runInitDb(): Promise<void> {
  const client = await getClient();
  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS site_likes (
        id INTEGER PRIMARY KEY DEFAULT 1,
        count INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await client.sql`
      CREATE TABLE IF NOT EXISTS post_likes (
        slug TEXT PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await client.sql`
      INSERT INTO site_likes (id, count)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING;
    `;
    await client.sql`
      CREATE TABLE IF NOT EXISTS site_content (
        type TEXT NOT NULL,
        slug TEXT NOT NULL,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        summary TEXT NOT NULL DEFAULT '',
        tags JSONB NOT NULL DEFAULT '[]'::jsonb,
        body TEXT NOT NULL,
        extra JSONB NOT NULL DEFAULT '{}'::jsonb,
        draft BOOLEAN NOT NULL DEFAULT false,
        pinned BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (type, slug)
      );
    `;
    await client.sql`
      CREATE INDEX IF NOT EXISTS site_content_type_date_idx
      ON site_content (type, date DESC, updated_at DESC);
    `;
  } finally {
    client.release();
  }
}

export async function initDb(): Promise<void> {
  if (!initPromise) {
    initPromise = runInitDb().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

/**
 * 获取首页点赞数
 */
export async function getSiteLikes(): Promise<number> {
  const client = await getClient();
  try {
    const { rows } = await client.sql`
      SELECT count FROM site_likes WHERE id = 1;
    `;
    return rows.length > 0 ? rows[0].count : 0;
  } finally {
    client.release();
  }
}

/**
 * 首页点赞 +1
 */
export async function incrementSiteLikes(): Promise<number> {
  const client = await getClient();
  try {
    const { rows } = await client.sql`
      UPDATE site_likes
      SET count = count + 1, updated_at = NOW()
      WHERE id = 1
      RETURNING count;
    `;
    return rows.length > 0 ? rows[0].count : 0;
  } finally {
    client.release();
  }
}

/**
 * 获取某篇文章的点赞数
 */
export async function getPostLikes(slug: string): Promise<number> {
  const client = await getClient();
  try {
    const { rows } = await client.sql`
      SELECT count FROM post_likes WHERE slug = ${slug};
    `;
    return rows.length > 0 ? rows[0].count : 0;
  } finally {
    client.release();
  }
}

/**
 * 文章点赞 +1
 */
export async function incrementPostLikes(slug: string): Promise<number> {
  const client = await getClient();
  try {
    const { rows } = await client.sql`
      INSERT INTO post_likes (slug, count, updated_at)
      VALUES (${slug}, 1, NOW())
      ON CONFLICT (slug)
      DO UPDATE SET count = post_likes.count + 1, updated_at = NOW()
      RETURNING count;
    `;
    return rows.length > 0 ? rows[0].count : 0;
  } finally {
    client.release();
  }
}

function normalizeContentRow(row: Record<string, unknown>): DbContentRow {
  return {
    type: String(row.type) as ContentType,
    slug: String(row.slug),
    title: String(row.title),
    date: String(row.date),
    summary: String(row.summary ?? ""),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    body: String(row.body ?? ""),
    extra: row.extra && typeof row.extra === "object" ? (row.extra as Record<string, unknown>) : {},
    draft: Boolean(row.draft),
    pinned: Boolean(row.pinned),
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
  };
}

/**
 * 新增或更新一篇数据库内容。
 */
export async function upsertContent(input: DbContentInput): Promise<DbContentRow> {
  await initDb();
  const client = await getClient();
  const tagsJson = JSON.stringify(input.tags);
  const extraJson = JSON.stringify(input.extra ?? {});
  try {
    const { rows } = await client.sql`
      INSERT INTO site_content (
        type, slug, title, date, summary, tags, body, extra, draft, pinned, updated_at
      )
      VALUES (
        ${input.type},
        ${input.slug},
        ${input.title},
        ${input.date},
        ${input.summary},
        ${tagsJson}::jsonb,
        ${input.body},
        ${extraJson}::jsonb,
        ${Boolean(input.draft)},
        ${Boolean(input.pinned)},
        NOW()
      )
      ON CONFLICT (type, slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        date = EXCLUDED.date,
        summary = EXCLUDED.summary,
        tags = EXCLUDED.tags,
        body = EXCLUDED.body,
        extra = EXCLUDED.extra,
        draft = EXCLUDED.draft,
        pinned = EXCLUDED.pinned,
        updated_at = NOW()
      RETURNING *;
    `;
    return normalizeContentRow(rows[0]);
  } finally {
    client.release();
  }
}

export async function getDbContentByType(type: ContentType): Promise<DbContentRow[]> {
  const client = await getClient();
  try {
    const { rows } = await client.sql`
      SELECT *
      FROM site_content
      WHERE type = ${type}
      ORDER BY date DESC, updated_at DESC;
    `;
    return rows.map(normalizeContentRow);
  } finally {
    client.release();
  }
}

export async function getDbContentBySlug(type: ContentType, slug: string): Promise<DbContentRow | null> {
  const client = await getClient();
  try {
    const { rows } = await client.sql`
      SELECT *
      FROM site_content
      WHERE type = ${type} AND slug = ${slug}
      LIMIT 1;
    `;
    return rows[0] ? normalizeContentRow(rows[0]) : null;
  } finally {
    client.release();
  }
}

export async function deleteDbContent(type: ContentType, slug: string): Promise<boolean> {
  await initDb();
  const client = await getClient();
  try {
    const { rowCount } = await client.sql`
      DELETE FROM site_content
      WHERE type = ${type} AND slug = ${slug};
    `;
    return (rowCount ?? 0) > 0;
  } finally {
    client.release();
  }
}
