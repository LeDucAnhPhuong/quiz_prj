"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizProps {
  questions: QuizQuestion[];
}

export default function Quiz({ questions }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setIsAnswerSubmitted(true);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsAnswerSubmitted(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  console.log(currentQuestion.question);

  if (quizCompleted) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-2xl font-bold mb-4">
            Your Score: {score} / {questions.length}
          </p>
          <p className="mb-4">
            {score === questions.length
              ? "Perfect! You got all questions correct!"
              : score > questions.length / 2
              ? "Good job! You passed the quiz."
              : "Keep practicing to improve your score."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleRestartQuiz}>Restart Quiz</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-muted-foreground">Score: {score}</span>
        </div>
        <CardTitle
          // dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
        >
          {currentQuestion.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer || ""} className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="flex items-center space-x-2 border rounded-lg p-3 w-full hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => handleAnswerSelect(option)}
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  disabled={isAnswerSubmitted}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-grow cursor-pointer"
                >
                  {option}
                </Label>
                {isAnswerSubmitted &&
                  option === currentQuestion.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                {isAnswerSubmitted &&
                  selectedAnswer === option &&
                  option !== currentQuestion.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isAnswerSubmitted ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1
              ? "Next Question"
              : "See Results"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
