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
                toast.error("Failed to load quiz questions", {
                    description: "Please try again later",
                });
                navigate("/");
            }
        }
        loadData();
    }, [navigate]);

    useEffect(() => {
        if (!quizStarted || showResults) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeout();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, currentQuestion, showResults]);

    const handleTimeout = useCallback(() => {
        toast.warning("Time's up!", {
            description: "Moving to next question",
        });

        handleNextQuestion(null);
    }, []);

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
            toast.success("Correct answer!", {
                description: "Well done! 🎉",
            });
        } else {
            toast.error("Incorrect answer", {
                description: `The correct answer was: ${currentQuestionData.answer}`,
            });
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

        if (percentage >= 80) message = "Excellent performance! 🏆";
        else if (percentage >= 60) message = "Good job! 👍";
        else message = "Keep practicing! 💪";

        toast.message("Quiz Completed!", {
            description: `${message}\nScore: ${correctAnswers}/${
                questions.length
            } (${percentage.toFixed(1)}%)`,
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
                                    {answer.selectedAnswer || "Not answered"}
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
                                variant="ghost"
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Are you sure you want to quit the quiz?"
                                        )
                                    ) {
                                        navigate("/");
                                    }
                                }}
                            >
                                Quit Quiz
                            </Button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
