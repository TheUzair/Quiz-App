import { toast } from "sonner";
import { fallbackQuestions } from "./fallbackQuestions";

export async function fetchQuizData() {
    try {
        const apiKey = import.meta.env.VITE_QUIZ_API_KEY;
        const apiUrl = import.meta.env.VITE_QUIZ_API_URL;

        console.log("API Key:", apiKey);
        console.log("API URL:", apiUrl);

        if (!apiKey || !apiUrl) {
            throw new Error("API configuration missing");
        }

        const res = await fetch(`${apiUrl}?apiKey=${apiKey}&limit=10`);

        if (!res.ok) {
            throw new Error("Failed to fetch quiz data");
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid API response");
        }

        return data.map((q) => ({
            id: q.id,
            question: q.question,
            options: shuffleOptions(
                Object.values(q.answers).filter((option) => option !== null)
            ),
            answer: getCorrectAnswer(q.answers, q.correct_answers),
        }));
    } catch (error) {
        console.error("Error fetching quiz data:", error.message);
        toast(
            "⚠️ Using Offline Quiz\nLive quiz unavailable. Showing offline questions."
        );
        return fallbackQuestions;
    }
}

// Keep the same helper functions
function shuffleOptions(options) {
    return options.sort(() => Math.random() - 0.5);
}

function getCorrectAnswer(answers, correct_answers) {
    for (const key in correct_answers) {
        if (correct_answers[key] === "true") {
            const answerKey = key.replace("_correct", "");
            return answers[answerKey];
        }
    }
    return null;
}
