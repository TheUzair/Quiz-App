import { toast } from "sonner";
import { fallbackQuestions } from "./fallbackQuestions";

export async function fetchQuizData() {
  try {
    const res = await fetch("/api/questions?limit=10");

    if (!res.ok) {
      throw new Error(`Failed to fetch quiz data: ${res.status}`);
    }

    const json = await res.json();

    if (!json.success || !Array.isArray(json.data)) {
      throw new Error("Invalid API response");
    }

    return json.data.map((q) => ({
      id: q.id,
      question: q.text,
      options: shuffleOptions(q.answers.map((a) => a.text)),
      answer: q.answers.find((a) => a.isCorrect)?.text ?? null,
    }));
  } catch (error) {
    console.error("Error fetching quiz data:", error.message);
    toast(
      "⚠️ Using Offline Quiz\nLive quiz unavailable. Showing offline questions.",
    );
    return fallbackQuestions;
  }
}

function shuffleOptions(options) {
  return options.sort(() => Math.random() - 0.5);
}
