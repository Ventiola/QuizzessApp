import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
  getDocsFromCache,
  writeBatch,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "quizzes"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setQuizzes(items);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    const ok = confirm("Delete this quiz? This action cannot be undone.");
    if (!ok) return;

    try {
      const questionsSnap = await getDocs(collection(db, "quizzes", quizId, "questions"));
      const batch = writeBatch(db);
      questionsSnap.forEach((qd) => {
        batch.delete(doc(db, "quizzes", quizId, "questions", qd.id));
      });

      batch.delete(doc(db, "quizzes", quizId));

      await batch.commit();

      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      alert("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-300 mt-1">Manage Quizz.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/CreateQuiz")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
            >
              Create Quiz
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-400">Total Quizzes</div>
            <div className="text-2xl font-bold">{loading ? "..." : quizzes.length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-400">Active Users</div>
            <div className="text-2xl font-bold">—</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-400">--</div>
            <div className="text-2xl font-bold">—</div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Quizzes</h2>

          {loading && (
            <div className="p-6 bg-gray-800 rounded">Loading quizzes...</div>
          )}

          {error && (
            <div className="p-4 bg-red-600 rounded mb-4">{error}</div>
          )}

          {!loading && quizzes.length === 0 && (
            <div className="p-6 bg-gray-800 rounded">No Quiz Found</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((q) => (
              <article key={q.id} className="bg-white text-gray-900 rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{q.title || "Untitled"}</h3>
                  {q.description && <p className="text-sm text-gray-600 mt-1">{q.description}</p>}
                  <div className="text-sm text-gray-500 mt-2">ID: {q.id}</div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/edit/${q.id}`)}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => navigate(`/quiz/${q.id}/1`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Preview
                    </button>

                    <button
                      onClick={() => handleDelete(q.id)}
                      className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}


