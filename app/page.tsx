import Quiz from "@/components/Quiz";
import type { QuizQuestion } from "@/types";
import path from "path";
import { promises as fs } from "fs";
import he from "he";
import { log } from "console";
import Papa from "papaparse";
export default async function Home() {
  const questions = await getQuizQuestions();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Next.js Quiz</h1>
      <Quiz questions={questions} />
    </main>
  );
}

async function getQuizQuestions(): Promise<QuizQuestion[]> {
  const filePath = path.join(process.cwd(), "public", "quiz_questions.csv");
  const fileContents = await fs.readFile(filePath, "utf8");
  const parsedData = Papa.parse(fileContents as any, {
    header: false, // Không có dòng tiêu đề
  });
  const lines: string[][] = parsedData.data as string[][];
  const questions: QuizQuestion[] = [];
  let currentQuestion: QuizQuestion | null = null;

  for (const line of lines) {
    const [question, answer]: string[] = line?.map((item) =>
      he.decode(item.trim())
    ) ?? ["", ""];
    if (!currentQuestion || currentQuestion.question !== question) {
      if (currentQuestion && currentQuestion.options.length === 4) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        question,
        options: [answer],
        correctAnswer: answer,
      };
    } else if (currentQuestion.options.length < 4) {
      currentQuestion.options.push(answer);
    }
  }

  if (currentQuestion && currentQuestion.options.length === 4) {
    questions.push(currentQuestion);
  }

  // Shuffle the questions
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions;
}
