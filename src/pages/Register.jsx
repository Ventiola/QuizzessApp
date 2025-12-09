import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Password is not matching!");
      return;
    }

    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: "user",
        createdAt: Date.now(),
      });

      alert("register successful!");

      navigate("/login");

    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else {
        setError("something bad happen.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 focus:outline-none"
              placeholder="full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-700 focus:outline-none"
              placeholder="email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-700 focus:outline-none"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Konfirmasi Password</label>
            <input
              type="password"
              className={`w-full p-2 rounded bg-gray-700 focus:outline-none ${
                confirm && password !== confirm ? "border border-red-500" : ""
              }`}
              placeholder="Ulangi password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded mt-2"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
