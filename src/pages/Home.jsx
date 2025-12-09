import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Card from "../components/Card";

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const qRef = collection(db, "quizzes");
      const qSnap = await getDocs(qRef);

      const list = qSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setQuizzes(list);
    };

    fetchData();
  }, []);

  return (
    <main className="p-8 flex flex-col items-center bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6">Quiz Apps</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {quizzes.map(q => (
          <Card key={q.id} id={q.id} title={q.title} img={q.image} />
        ))}
      </div>
    </main>
  );
}
