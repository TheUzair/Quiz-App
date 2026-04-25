const QUIZ_API_URL = "https://quizapi.io/api/v1/questions";

export default async function handler(req, res) {
  const QUIZ_API_KEY = process.env.QUIZ_API_KEY;

  if (!QUIZ_API_KEY) {
    return res.status(500).json({ error: "QUIZ_API_KEY is not configured" });
  }

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
}
