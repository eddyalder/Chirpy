const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function init() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS birds (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0
    );
  `);
}

async function ensureBird(slug) {
    const res = await pool.query("SELECT * FROM birds WHERE slug = $1", [slug]);
    if (res.rows.length > 0) return res.rows[0];

    const insert = await pool.query(
        "INSERT INTO birds (slug) VALUES ($1) RETURNING *",
        [slug]
    );
    return insert.rows[0];
}

module.exports = { pool, init, ensureBird };
