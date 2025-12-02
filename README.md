# 🐦 Chirpy - Bird Sound Battle

**Chirpy** is an interactive web application where users listen to bird sounds and vote for their favorites. It features a "hot-or-not" style battle arena and a live leaderboard tracking the most popular avian vocalists.

![Chirpy Screenshot](/public/favicon.svg)

## ✨ Features

-   **Bird Battles:** Listen to two random bird recordings from the Xeno-Canto API and vote for the best one.
-   **Live Leaderboard:** Real-time ranking of birds based on user votes.
-   **Rich Media:** High-quality bird images (via Wikipedia) and audio recordings.
-   **Responsive Design:** Works beautifully on desktop and mobile.
-   **Glassmorphism UI:** Modern, clean aesthetic with smooth animations.

## 🛠️ Tech Stack

-   **Frontend:** React, Vite, CSS Modules (Glassmorphism design)
-   **Backend:** Node.js, Express
-   **Database:** PostgreSQL
-   **APIs:** Xeno-Canto (Audio), Wikipedia (Images)
-   **Deployment:** Vercel (Frontend), Render (Backend & DB)

---

## 🚀 Local Development

Follow these steps to run Chirpy on your local machine.

### Prerequisites

-   Node.js (v16+)
-   npm

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chirpy.git
cd chirpy
```

### 2. Frontend Setup

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file in the root directory:
    ```env
    VITE_API_BASE_URL=http://localhost:3001
    VITE_XENO_CANTO_KEY=your_xeno_canto_api_key
    ```
3.  Start the frontend:
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:5173`.

### 3. Backend Setup

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory. You will need a PostgreSQL database URL.
    *   *Option A (Local DB):* Install PostgreSQL locally and create a database named `chirpy`.
    *   *Option B (Cloud DB):* Use a connection string from a provider like Render or Neon.
    ```env
    PORT=3001
    DATABASE_URL=postgresql://user:password@localhost:5432/chirpy
    ```
    *(Note: If connecting to a remote Render DB from localhost, append `?ssl=true` to the URL)*

4.  Start the server:
    ```bash
    npm start
    ```
    The server will run at `http://localhost:3001`.

---

## ☁️ Deployment (Vercel & Render)

### 1. Deploy Backend to Render

Follow Render's documentation to deploy your Node.js Express backend and PostgreSQL database.

### 2. Deploy Frontend to Vercel

1.  Connect your GitHub repository to Vercel.
2.  Configure the build settings (Vite should be detected automatically).
3.  **Environment Variables:**
    -   `VITE_API_BASE_URL`: The URL of your deployed Render backend (e.g., `https://chirpy-backend.onrender.com`).
    -   `VITE_XENO_CANTO_KEY`: Your Xeno-Canto API key.
4.  Deploy your project.

---

## 📂 Project Structure

```
chirpy/
├── backend/            # Express server & DB logic
│   ├── server.js       # API endpoints
│   ├── db.js           # Database connection
│   └── package.json
├── src/                # React Frontend
│   ├── components/     # UI Components (BirdCard, Leaderboard, etc.)
│   ├── services/       # API services (xenoCanto, imageService, api)
│   ├── App.jsx         # Main application logic
│   └── index.css       # Global styles
├── public/             # Static assets (favicon)
└── index.html          # Entry point
```
