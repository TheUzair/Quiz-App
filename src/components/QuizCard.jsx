import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export default function QuizCard({
    question,
    options,
    onAnswerSelect,
    currentQuestion,
    totalQuestions,
}) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
                <div className="mb-4 text-sm text-gray-500">
                    Question {currentQuestion} of {totalQuestions}
                </div>

                <h2
                    className="text-xl font-semibold mb-6"
                    dangerouslySetInnerHTML={{ __html: question }}
                />

                <div className="grid gap-4">
                    {options.map((option, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className="w-full h-full text-left justify-start p-4 hover:bg-gray-100 transition-colors"
                            onClick={() => onAnswerSelect(option)}
                            style={{
                                whiteSpace: "normal", // Allow wrapping of long text
                                wordWrap: "break-word", // Break long words onto the next line
                                overflowWrap: "break-word", // Prevent text overflow
                            }}
                        >
                            <span
                                className="inline-block"
                                dangerouslySetInnerHTML={{ __html: option }}
                            />
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
