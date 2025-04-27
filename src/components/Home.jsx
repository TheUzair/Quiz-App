import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardContent className="p-6">
                    <h1 className="text-3xl font-bold text-center mb-6">
                        Welcome to Quiz App
                    </h1>
                    <p className="text-gray-600 text-center mb-8">
                        Test your knowledge with our interactive quiz!
                    </p>
                    <div className="flex justify-center">
                        <Button
                            onClick={() => navigate("/quiz")}
                            className="w-full max-w-xs"
                            size="lg"
                        >
                            Start Quiz
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
