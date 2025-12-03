require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { pool, init, ensureBird } = require("./db");

const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Comprehensive logging with Morgan
// Logs: :method :url :status :response-time ms - :res[content-length]
app.use(morgan('dev'));

// Custom logging for detailed request body (useful for debugging votes)
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
    }
    next();
});

// Health check for Render wake-up
app.get("/api/health", (req, res) => res.send("OK"));

// Vote submission
app.post("/api/vote", async (req, res) => {
    const { winnerSlug, loserSlug } = req.body;
    if (!winnerSlug || !loserSlug) {
        return res.status(400).json({ error: "winnerSlug and loserSlug required" });
    }

    try {
        await init();
        await Promise.all([ensureBird(winnerSlug), ensureBird(loserSlug)]);

        await pool.query("BEGIN");
        await pool.query("UPDATE birds SET wins = wins + 1 WHERE slug = $1", [winnerSlug]);
        await pool.query("UPDATE birds SET losses = losses + 1 WHERE slug = $1", [loserSlug]);
        const updated = await pool.query(
            "SELECT * FROM birds WHERE slug = ANY($1::text[])",
            [[winnerSlug, loserSlug]]
        );
        await pool.query("COMMIT");

        res.json({ updated: updated.rows });
    } catch (err) {
        console.error(err);
        await pool.query("ROLLBACK").catch(() => { });
        res.status(500).json({ error: "internal error" });
    }
});

// Leaderboard
app.get("/api/leaderboard", async (req, res) => {
    const limit = Number(req.query.limit) || 50;
    try {
        const result = await pool.query(
            `SELECT id, slug, wins, losses, (wins + losses) AS total_matches
       FROM birds
       WHERE wins + losses > 0
       ORDER BY wins DESC, total_matches DESC
       LIMIT $1`,
            [limit]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "internal error" });
    }
});

// Initialize DB on startup
init().then(() => {
    console.log("Database initialized");
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}).catch(err => {
    console.error("Failed to initialize database:", err);
});
