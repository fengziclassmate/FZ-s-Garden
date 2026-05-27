import { createPool } from "@vercel/postgres";
import type { VercelPool, VercelPoolClient } from "@vercel/postgres";

let pool: VercelPool | null = null;

function getPool(): VercelPool {
  if (!pool) {
    pool = createPool({
      connectionString: process.env.POSTGRES_URL,
    });
  }
  return pool;
}

export async function getClient(): Promise<VercelPoolClient> {
  return await getPool().connect();
}

/**
 * 初始化数据库表（幂等，safe to run every time）
 */
export async function initDb(): Promise<void> {
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
    // 确保 site_likes 至少有一行
    await client.sql`
      INSERT INTO site_likes (id, count)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING;
    `;
  } finally {
    client.release();
  }
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
 * 文章点赞 +1（幂等，由前端控制每人限一次）
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

/**
 * 获取多篇文章的点赞数（批量）
 */
export async function getPostLikesMap(slugs: string[]): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};
  const client = await getClient();
  try {
    const placeholders = slugs.map((_, i) => `$${i + 1}`).join(",");
    const { rows } = await client.query(
      `SELECT slug, count FROM post_likes WHERE slug IN (${placeholders})`,
      slugs,
    );
    const map: Record<string, number> = {};
    for (const row of rows) {
      map[row.slug] = row.count;
    }
    return map;
  } finally {
    client.release();
  }
}
