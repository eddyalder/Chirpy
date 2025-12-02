const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function submitVote(winnerSlug, loserSlug) {
    try {
        const response = await fetch(`${API_BASE}/api/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ winnerSlug, loserSlug }),
        });
        return await response.json();
    } catch (error) {
        console.error("Failed to submit vote:", error);
        return null;
    }
}

export async function getLeaderboard(limit = 50) {
    try {
        const response = await fetch(`${API_BASE}/api/leaderboard?limit=${limit}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        return [];
    }
}
