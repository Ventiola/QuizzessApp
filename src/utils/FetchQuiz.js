import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchQuiz(quizId) {
  console.log("FETCH QUIZ ID:", quizId);

  // 1. Ambil dokumen quiz
  const quizRef = doc(db, "quizzes", quizId);
  const quizSnap = await getDoc(quizRef);

  if (!quizSnap.exists()) return null;

  const quizData = { id: quizId, ...quizSnap.data() };

  // 2. Ambil subcollection questions
  const qCol = collection(db, "quizzes", quizId, "questions");
  const qSnap = await getDocs(qCol);

  let questions = [];

  // LOOP setiap question
  for (const qDoc of qSnap.docs) {
    const qData = qDoc.data();

    // 3. Ambil subcollection options dari question ini
    const optCol = collection(
      db,
      "quizzes",
      quizId,
      "questions",
      qDoc.id,
      "options"
    );
    const optSnap = await getDocs(optCol);

    const options = optSnap.docs.map((optDoc) => {
      const opt = optDoc.data();

      console.log("OPTION DATA FIRESTORE:", optDoc.id, opt);

      return {
        id: optDoc.id,
        text: opt["o-text"],
        isCorrect: opt["is-correct"],
      };
    });

    // push QA lengkap
    questions.push({
      id: qDoc.id,
      "q-text": qData["q-text"],
      options: options,
    });
  }

  return { ...quizData, questions };
}
