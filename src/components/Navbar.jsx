import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const { user, userData } = useAuth();
  const navigate = useNavigate(); // <-- WAJIB ADA

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-700">
      <div className="text-white px-6 py-3 shadow-md flex justify-between items-center mx-12">
        <h1 className="text-2xl font-bold">Quiz App</h1>

        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
          <li><Link to="/about" className="hover:text-gray-200">About</Link></li>
          <li><Link to="/contact" className="hover:text-gray-200">Contact</Link></li>

          {!user ? (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-500 rounded text-white"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="px-4 py-2 bg-green-600 rounded">
                {userData?.name || user.email}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
}
