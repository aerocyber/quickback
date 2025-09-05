"use client"; // if you’re in Next.js App Router

import { useAuth } from "../context/authcontext";

import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, loading } = useAuth();


  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">
            <Link to="/">QuickBack</Link>
        </h1>
        {!loading && (
          <div>
            {user ? (
              <Link to={"/account"} className="text-white hover:text-gray-300">
                Account
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-300">
                  Sign in with GitHub
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
