import express from "express";
import { createRequire } from "module";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Manually load .env.local since dotenv only reads .env by default
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env.local");
try {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {
  // .env.local not found — rely on actual environment variables
}

const app = express();
const PORT = 3001;

const QUIZ_API_KEY = process.env.QUIZ_API_KEY;
const QUIZ_API_URL = "https://quizapi.io/api/v1/questions";

if (!QUIZ_API_KEY) {
  console.error("QUIZ_API_KEY is not set. Add it to .env.local");
  process.exit(1);
}

app.get("/api/questions", async (req, res) => {
  const { limit = 10, category, difficulty } = req.query;
  const params = new URLSearchParams({ api_key: QUIZ_API_KEY, limit });
  if (category) params.set("category", category);
  if (difficulty) params.set("difficulty", difficulty);

  try {
    const response = await fetch(`${QUIZ_API_URL}?${params}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Upstream API error" });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(502).json({ error: "Failed to reach quiz API" });
  }
});

app.listen(PORT, () => {
  console.log(`Quiz proxy server running at http://localhost:${PORT}`);
});
