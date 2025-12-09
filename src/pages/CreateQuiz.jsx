import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correct: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correct: 0 },
    ]);
  };

  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };


  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const updateCorrect = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correct = parseInt(value);
    setQuestions(updated);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) return setError("title must be filled.");
    if (questions.some((q) => q.question.trim() === "")) {
      return setError("question must be filled.");
    }

    setLoading(true);

    try {
      const quizRef = await addDoc(collection(db, "quizzes"), {
        title: title,
        description: desc,
        createdAt: Date.now(),
      });

      for (let qIndex = 0; qIndex < questions.length; qIndex++) {
        const q = questions[qIndex];

        // Buat dokumen untuk pertanyaan
        const questionRef = await addDoc(
          collection(db, "quizzes", quizRef.id, "questions"),
          {
            question: q.question,
          }
        );

        // 3. Simpan setiap opsi dalam subcollection "options"
        for (let optIndex = 0; optIndex < q.options.length; optIndex++) {
          const optionText = q.options[optIndex];
          const isCorrect = optIndex === q.correct;

          await setDoc(
            doc(
              db,
              "quizzes",
              quizRef.id,
              "questions",
              questionRef.id,
              "options",
              `o-${optIndex + 1}`
            ),
            {
              "o-text": optionText,
              "is-correct": isCorrect,
            }
          );
        }
      }

      alert("Quiz created successfully!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Fail to create quiz.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Create Quiz</h1>

        {error && (
          <p className="bg-red-600 p-3 rounded text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg mb-1">Quiz Title</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 outline-none"
              placeholder="Contoh: Quiz Matematika Dasar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-lg mb-1">Image URL</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 outline-none"
              placeholder="https://contoh.com/gambar.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-lg mb-1">Description (Opsional)</label>
            <textarea
              rows={3}
              className="w-full p-2 rounded bg-gray-700 outline-none"
              placeholder="Desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Questions</h2>

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-gray-700 p-4 rounded-lg mb-4 shadow"
              >
                <label className="block font-medium mb-2">
                  Questions {qIndex + 1}
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-gray-600 mb-3"
                  placeholder="Questions..."
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      className="p-2 rounded bg-gray-600"
                      placeholder={`Opsi ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) =>
                        updateOption(qIndex, optIndex, e.target.value)
                      }
                      required
                    />
                  ))}
                </div>

                <div className="mt-3">
                  <label className="block mb-1">True</label>
                  <select
                    value={q.correct}
                    onChange={(e) => updateCorrect(qIndex, e.target.value)}
                    className="p-2 bg-gray-600 rounded"
                  >
                    <option value={0}>Opt 1</option>
                    <option value={1}>Opt 2</option>
                    <option value={2}>Opt 3</option>
                    <option value={3}>Opt 4</option>
                  </select>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              + Add Questions
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded mt-4 font-semibold"
          >
            {loading ? "Saving..." : "Save Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
}
