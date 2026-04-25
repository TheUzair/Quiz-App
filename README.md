# 🎯 Quiz App

A dynamic and engaging quiz application built with React.js, featuring timed questions, answer validation, and real-time progress tracking.

🔗 **Live Demo:** [Quiz App on Vercel](https://quiz-app-ten-swart.vercel.app/)

![Quiz App Screenshot](/public/quiz-app-ss.jpg)

---

## ✨ Key Features

| Feature                     | Description                                               |
| --------------------------- | --------------------------------------------------------- |
| **⏱️ Timed Questions**      | 30-second limit per question with auto-submit on timeout. |
| **📊 Progress Tracking**    | Visual progress bar showing completion percentage.        |
| **✅ Answer Validation**    | Instant feedback (correct/incorrect) after selection.     |
| **📱 Responsive Design**    | Works seamlessly on mobile, tablet, and desktop.          |
| **🌐 Offline Support**      | Fallback questions if API fails.                          |
| **🏆 Performance Feedback** | Personalized results message based on score.              |

---

## 🛠️ Technologies

### Frontend

-   **React.js** (Vite)
-   **Tailwind CSS** + **Shadcn/UI** (Styled components)
-   **React Router** (Navigation)
-   **Lucide-react** (Icons)

### Backend

-   **[QuizAPI.io](https://quizapi.io/)** (Primary question source)

### Deployment

-   **Vercel** (Hosting)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/)
-   [npm](https://npmjs.com/)

### Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/theuzair/quiz-app.git
    ```

2. Navigate into the project directory:

    ```bash
    cd quiz-app
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. (Optional) Create a `.env.local` file in the root directory for storing environment variables (e.g., API keys, if required).

5. Run the app locally:

    ```bash
    npm run dev
    ```

6. Open the app in your browser at [http://localhost:5173](http://localhost:5173).

---

## 📂 Project Structure

```
/quiz-app
├── /components
│   ├── QuizCard.js        # Component for displaying each quiz question and options
│   ├── ui/
│   │   ├── button.js      # UI components like Button
│   │   ├── progress.js    # Progress bar component
├── /data
│   ├── quizData.js        # Helper functions to fetch quiz data and handle questions
├── /pages
│   ├── index.js           # Landing page to start the quiz
│   ├── question.js        # Page for displaying each question and handling user answers
├── /public
│   ├── /images            # Static assets (images, icons, etc.)
├── tailwind.config.js      # Tailwind CSS configuration
├── package.json            # Project dependencies and scripts
├── README.md               # Project README
└── .gitignore              # Git ignore file

```

---

## � Usage Guide

1. **Start Quiz**

    - Click "Start Quiz" to begin.

2. **Answer Questions**

    - Select an option or wait for timeout (30s).  
      ![Question Example](/public/ques-ss.jpg)

3. **View Results**

    - Score breakdown and performance feedback.

4. **Restart**
    - Click "Restart Quiz" to play again.

---

## 🌟 Advanced Features

### Timeout Handling

```jsx
useEffect(() => {
    const timer = setTimeout(() => {
        handleNextQuestion();
    }, 30000);
    return () => clearTimeout(timer);
}, [currentQuestion]);
```

### Fallback Data System

If the API fails, the app loads fallback questions.

---

## 🤝 Contributing

We welcome contributions from the community. If you'd like to contribute, please follow the steps below:

1. **Fork** the repository to your own GitHub account.
2. **Clone** the forked repository to your local machine:

    ```bash
    git clone https://github.com/theuzair/quiz-app.git
    ```

3. Create a **new branch** for your feature or fix:

    ```bash
    git checkout -b feature-branch
    ```

4. **Make changes** and commit them with a descriptive message:

    ```bash
    git commit -am 'Add new feature or fix bug'
    ```

5. Push your changes to your forked repository:

    ```bash
    git push origin feature-branch
    ```

6. Open a **pull request** to the main repository with a description of your changes.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---
