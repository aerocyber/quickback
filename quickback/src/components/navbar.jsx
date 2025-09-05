import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">QuickBack</h1>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/account" className="text-gray-300 hover:text-white">
                Account
              </Link>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/signup" className="text-gray-300 hover:text-white">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
