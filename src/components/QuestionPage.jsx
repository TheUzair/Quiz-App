import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "./QuizCard";
import { fetchQuizData } from "../data/quizData";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function QuestionPage() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [quizStarted, setQuizStarted] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const data = await fetchQuizData();
                setQuestions(data);
                setLoading(false);
            } catch (error) {
                toast.error(
                    "Failed to load quiz questions. Please try again later.",
                    {
                        action: {
                            label: "Retry",
                            onClick: () => loadData(),
                        },
                        style: {
                            background: "#FEF2F2",
                            color: "#B91C1C",
                            borderLeft: "4px solid #DC2626",
                        },
                    }
                );
                navigate("/");
            }
        }
        loadData();
    }, [navigate]);

    const handleTimeout = useCallback(() => {
        toast("Time's up! Moving to next question.", {
            style: {
                background: "#FFFBEB",
                color: "#92400E",
                borderLeft: "4px solid #F59E0B",
            },
        });

        // Only record if we haven't already recorded this unanswered question
        setSelectedAnswers((prev) => {
            // Check if we've already recorded this question
            if (
                prev.some(
                    (a) => a.question === questions[currentQuestion].question
                )
            ) {
                return prev;
            }

            return [
                ...prev,
                {
                    question: questions[currentQuestion].question,
                    selectedAnswer: null,
                    correctAnswer: questions[currentQuestion].answer,
                    isCorrect: false,
                },
            ];
        });

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setTimeLeft(30);
        } else {
            setShowResults(true);
            displayResults();
        }
    }, [currentQuestion, questions]);

    useEffect(() => {
        if (!quizStarted || showResults) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, currentQuestion, showResults, handleTimeout]);

    useEffect(() => {
        if (!quizStarted || showResults) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, currentQuestion, showResults, handleTimeout]);

    const progress = (currentQuestion / questions.length) * 100;

    const handleAnswer = (selectedOption) => {
        const currentQuestionData = questions[currentQuestion];
        const isCorrect = selectedOption === currentQuestionData.answer;

        setSelectedAnswers((prev) => [
            ...prev,
            {
                question: currentQuestionData.question,
                selectedAnswer: selectedOption,
                correctAnswer: currentQuestionData.answer,
                isCorrect,
            },
        ]);

        if (isCorrect) {
            setCorrectAnswers((prev) => prev + 1);
            toast("Correct! Well done! 🎉", {
                style: {
                    background: "#ECFDF5",
                    color: "#065F46",
                    borderLeft: "4px solid #10B981",
                },
            });
        } else {
            toast(
                `Incorrect! The correct answer was: ${currentQuestionData.answer}`,
                {
                    style: {
                        background: "#FEF2F2",
                        color: "#B91C1C",
                        borderLeft: "4px solid #EF4444",
                    },
                    action: {
                        label: "Learn More",
                        onClick: () =>
                            window.open(
                                `https://www.google.com/search?q=${encodeURIComponent(
                                    currentQuestionData.question
                                )}`,
                                "_blank"
                            ),
                    },
                }
            );
        }

        handleNextQuestion(selectedOption);
    };

    const handleNextQuestion = (selectedOption) => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setTimeLeft(30);
        } else {
            setShowResults(true);
            displayResults();
        }
    };

    const displayResults = () => {
        const percentage = (correctAnswers / questions.length) * 100;
        let message = "";

        if (percentage >= 80)
            message = `Excellent! 🏆 You scored ${correctAnswers}/${
                questions.length
            } (${percentage.toFixed(1)}%)`;
        else if (percentage >= 60)
            message = `Good job! 👍 You scored ${correctAnswers}/${
                questions.length
            } (${percentage.toFixed(1)}%)`;
        else
            message = `Keep practicing! 💪 You scored ${correctAnswers}/${
                questions.length
            } (${percentage.toFixed(1)}%)`;

        toast(message, {
            style: {
                background: "#EFF6FF",
                color: "#1E40AF",
                borderLeft: "4px solid #3B82F6",
            },
            action: {
                label: "Review Answers",
                onClick: () =>
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                    }),
            },
        });
    };

    const handleRestartQuiz = () => {
        setCurrentQuestion(0);
        setCorrectAnswers(0);
        setTimeLeft(30);
        setSelectedAnswers([]);
        setShowResults(false);
        setQuizStarted(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-primary mb-4" />
                <p className="text-gray-600">Loading questions...</p>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
                    <div className="mb-6">
                        <p className="text-lg">
                            Final Score: {correctAnswers}/{questions.length}(
                            {(
                                (correctAnswers / questions.length) *
                                100
                            ).toFixed(1)}
                            %)
                        </p>
                    </div>

                    <div className="space-y-4 mb-6">
                        {selectedAnswers.map((answer, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg ${
                                    answer.isCorrect
                                        ? "bg-green-50"
                                        : "bg-red-50"
                                }`}
                            >
                                <p
                                    className="font-medium mb-2"
                                    dangerouslySetInnerHTML={{
                                        __html: answer.question,
                                    }}
                                />
                                <p className="text-sm text-gray-600">
                                    Your answer:{" "}
                                    {answer.selectedAnswer ||
                                        "Time expired (no answer)"}
                                </p>
                                <p
                                    className={`text-sm ${
                                        answer.isCorrect
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    Correct answer: {answer.correctAnswer}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <Button onClick={handleRestartQuiz}>
                            Restart Quiz
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/")}>
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            {!quizStarted ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
                    <Button onClick={() => setQuizStarted(true)}>
                        Start Quiz
                    </Button>
                </div>
            ) : (
                questions.length > 0 && (
                    <div className="w-full max-w-2xl">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">
                                    Question {currentQuestion + 1} of{" "}
                                    {questions.length}
                                </span>
                                <span className="text-sm font-medium">
                                    Time left: {timeLeft}s
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>

                        <QuizCard
                            question={questions[currentQuestion].question}
                            options={questions[currentQuestion].options}
                            onAnswerSelect={handleAnswer}
                            currentQuestion={currentQuestion + 1}
                            totalQuestions={questions.length}
                        />

                        <div className="mt-4 text-center">
                            <Button
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                onClick={() => {
                                    toast(
                                        "Are you sure you want to quit? All progress will be lost.",
                                        {
                                            style: {
                                                background: "#FFFBEB",
                                                color: "#92400E",
                                                borderLeft: "4px solid #F59E0B",
                                            },
                                            action: {
                                                label: "Quit",
                                                onClick: () => navigate("/"),
                                                style: {
                                                    background: "#EF4444",
                                                    color: "white",
                                                },
                                            },
                                            cancel: {
                                                label: "Continue",
                                                style: {
                                                    background: "#10B981",
                                                    color: "white",
                                                },
                                            },
                                        }
                                    );
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Quit Quiz
                            </Button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
