import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizPage from "./pages/Quizpage.jsx";
import EditQuiz from "./pages/EditQuiz.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/admin";
import AdminRoute from "./components/AdminRoute";
import Register from "./pages/register.jsx";
import Navbar from "./components/Navbar.jsx";
import CreateQuiz from "./pages/Createquiz.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/CreateQuiz"
          element={
            <AdminRoute>
              <CreateQuiz />
            </AdminRoute>
          }
        />

        <Route
          path="/quiz/:quizId/:qnum?"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:quizId"
          element={
            <AdminRoute>
              <EditQuiz />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
