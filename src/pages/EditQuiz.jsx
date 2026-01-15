import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

export default function EditQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState ("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizSnap = await getDoc(doc(db, "quizzes", quizId));
        if (!quizSnap.exists()) return;

        const quizData = quizSnap.data();
        setTitle(quizData.title);
        setImage(quizData.image);
        setDesc(quizData.description || "");

        const qSnap = await getDocs(
          collection(db, "quizzes", quizId, "questions")
        );

        const loadedQuestions = [];

        const sortedQuestions = qSnap.docs.sort((a, b) =>
          a.id.localeCompare(b.id)
        );

        for (let q of sortedQuestions) {
          const qData = q.data();

          const optSnap = await getDocs(
            collection(db, "quizzes", quizId, "questions", q.id, "options")
          );

          const sortedOptions = optSnap.docs.sort((a, b) =>
            a.id.localeCompare(b.id)
          );

          const options = [];
          let correctIndex = 0;

          sortedOptions.forEach((optDoc, idx) => {
            const opt = optDoc.data();
            options.push(opt["o-text"]);

            if (opt["is-correct"]) {
              correctIndex = idx;
            }
          });

          loadedQuestions.push({
            id: q.id,
            question: qData.question,
            options: options,
            correct: correctIndex,
          });
        }

        setQuestions(loadedQuestions);
      } catch (err) {
        console.error("Gagal load quiz:", err);
      }

      setLoading(false);
    };

    loadQuiz();
  }, [quizId]);

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

  const handleSave = async () => {
    setLoading(true);

    try {

      await updateDoc(doc(db, "quizzes", quizId), {
        title: title,
        image: image,
        description: desc,
      });

      for (let q of questions) {
        const qRef = doc(db, "quizzes", quizId, "questions", q.id);
        await updateDoc(qRef, { question: q.question });

        for (let i = 0; i < q.options.length; i++) {
          await setDoc(
            doc(
              db,
              "quizzes",
              quizId,
              "questions",
              q.id,
              "options",
              `o-${i + 1}`
            ),
            {
              "o-text": q.options[i],
              "is-correct": q.correct === i,
            }
          );
        }
      }

      alert("Quiz is updated!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-white text-2xl">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Edit Quiz</h1>

        <div className="mb-4">
          <label className="block text-lg mb-1">Quiz Title</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-1">Image</label>
          <input
            type="url"
            className="w-full p-2 rounded bg-gray-700 outline-none"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg mb-1">Description</label>
          <textarea
            rows={3}
            className="w-full p-2 rounded bg-gray-700 outline-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={q.id} className="bg-gray-700 p-4 rounded mb-4">
            <label className="block font-medium mb-2">
              Questions {qIndex + 1}
            </label>

            <input
              type="text"
              className="w-full p-2 rounded bg-gray-600 mb-3"
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  className="p-2 rounded bg-gray-600"
                  value={opt}
                  onChange={(e) =>
                    updateOption(qIndex, optIndex, e.target.value)
                  }
                />
              ))}
            </div>

            <div className="mt-3">
              <label className="block mb-1">True Answer</label>
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
          onClick={handleSave}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 p-3 rounded font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
