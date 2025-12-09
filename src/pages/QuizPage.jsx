import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchQuiz } from "../utils/FetchQuiz";

export default function QuizPage() {
  const { quizId, qnum } = useParams();
  const questionIndex = qnum ? parseInt(qnum) - 1 : 0;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState("");

  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!quizId) {
      console.error("❌ ERROR: quizId from URL is undefined");
      return;
    }

    async function loadQuiz() {
      setLoading(true);
      const data = await fetchQuiz(quizId);

      console.log("HASIL FETCH QUIZ:", data);

      setQuiz(data);
      setLoading(false);
    }

    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    setSelectedOption(null);
    setIsChecked(false);
  }, [questionIndex]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Memuat quiz...
      </div>
    );

  if (!quiz)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Quiz tidak ditemukan
      </div>
    );

  const question = quiz.questions[questionIndex];

  if (!question)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">{quiz.title} Selesai 🎉</h1>
          <Link to="/home" className="text-blue-500 underline">
            Kembali ke Home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center text-white">
      <div className="p-10 max-w-xl w-full bg-white text-gray-900 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-4">{quiz.title} s</h1>
        

        <p className="text-lg mb-3">{question["q-text"]}</p>


        <ul className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.id;

            let itemClass = "border p-3 rounded cursor-pointer transition";

            if (isChecked) {
      
              if (isSelected && opt.isCorrect) {
                itemClass += " bg-green-500 text-white";
              } else if (isSelected && !opt.isCorrect) {
                itemClass += " bg-red-500 text-white"; 
              } else if (!isSelected && opt.isCorrect) {
                itemClass += " bg-green-500 text-white"; 
              } else {
                itemClass += " opacity-50"; 
              }
            } else {
            
              if (isSelected) {
                itemClass += " bg-blue-500 text-white";
              } else if (selectedOption) {
                itemClass += " opacity-50"; 
              }
            }

            return (
              <li
                key={opt.id}
                onClick={() => {
                  if (isChecked) return;
                  setSelectedOption(opt.id);
                  setIsChecked(true);
                }}
                className={itemClass}
              >
                {opt.text}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex justify-between">
          {questionIndex > 0 && (
            <Link
              to={`/quiz/${quizId}/${questionIndex}`}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Sebelumnya
            </Link>
          )}

          <Link
            to={`/quiz/${quizId}/${questionIndex + 2}`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
          >
            
          </Link>
        </div>
      </div>
    </div>
  );
}
