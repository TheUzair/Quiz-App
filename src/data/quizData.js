import { toast } from "sonner";

export async function fetchQuizData() {
    try {
        const res = await fetch(
            "https://quizapi.io/api/v1/questions?apiKey=HlFpol3tM2lz4mUxUED7jcGHLYHQKxI3QIMJjhtK&limit=10"
        );
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

        // Fallback questions in case the API fails
        return [
            {
                id: 1,
                question: "What is the capital of France?",
                options: ["Paris", "London", "Rome", "Berlin"],
                answer: "Paris",
            },
            {
                id: 2,
                question: "Which planet is known as the Red Planet?",
                options: ["Earth", "Mars", "Venus", "Jupiter"],
                answer: "Mars",
            },
            {
                id: 3,
                question: "Who wrote 'Hamlet'?",
                options: ["Shakespeare", "Dickens", "Hemingway", "Austen"],
                answer: "Shakespeare",
            },
            {
                id: 4,
                question: "What is the smallest prime number?",
                options: ["1", "2", "3", "5"],
                answer: "2",
            },
            {
                id: 5,
                question: "What is the largest mammal in the world?",
                options: ["Elephant", "Blue Whale", "Shark", "Giraffe"],
                answer: "Blue Whale",
            },
            {
                id: 6,
                question: "What is the boiling point of water?",
                options: ["90°C", "95°C", "100°C", "110°C"],
                answer: "100°C",
            },
            {
                id: 7,
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                answer: "Pacific",
            },
            {
                id: 8,
                question: "Who painted the Mona Lisa?",
                options: ["Da Vinci", "Van Gogh", "Picasso", "Monet"],
                answer: "Da Vinci",
            },
            {
                id: 9,
                question:
                    "Which country is known as the Land of the Rising Sun?",
                options: ["China", "Japan", "India", "South Korea"],
                answer: "Japan",
            },
            {
                id: 10,
                question: "What is the currency of the United Kingdom?",
                options: ["Euro", "Dollar", "Pound", "Yen"],
                answer: "Pound",
            },
        ];
    }
}

// Helper to shuffle options
function shuffleOptions(options) {
    return options.sort(() => Math.random() - 0.5);
}

// Helper to find the correct answer text
function getCorrectAnswer(answers, correct_answers) {
    for (const key in correct_answers) {
        if (correct_answers[key] === "true") {
            const answerKey = key.replace("_correct", "");
            return answers[answerKey];
        }
    }
    return null; // fallback
}
