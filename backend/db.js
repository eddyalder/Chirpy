const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes("onrender.com")
    ? { rejectUnauthorized: false }
    : process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS birds (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      common_name TEXT,
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Migration: Add common_name column if it doesn't exist (for existing DBs)
  try {
    await pool.query(`ALTER TABLE birds ADD COLUMN IF NOT EXISTS common_name TEXT;`);
  } catch (e) {
    console.log("Column common_name might already exist or error:", e.message);
  }
}

async function ensureBird(slug, commonName) {
  const res = await pool.query("SELECT * FROM birds WHERE slug = $1", [slug]);

  if (res.rows.length > 0) {
    // Update common name if it's missing or changed
    if (commonName && res.rows[0].common_name !== commonName) {
      console.log(`Updating common name for ${slug}: ${res.rows[0].common_name} -> ${commonName}`);
      await pool.query("UPDATE birds SET common_name = $1 WHERE slug = $2", [commonName, slug]);
    }
    return res.rows[0];
  }

  const insert = await pool.query(
    "INSERT INTO birds (slug, common_name) VALUES ($1, $2) RETURNING *",
    [slug, commonName]
  );
  return insert.rows[0];
}

module.exports = { pool, init, ensureBird };
