import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import QuestionPage from "./components/QuestionPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/quiz" element={<QuestionPage />} />
                    </Routes>
                </main>
                <Toaster />
            </div>
        </Router>
    );
}

export default App;
