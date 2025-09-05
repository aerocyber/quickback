import { Routes, Route, HashRouter, BrowserRouter } from "react-router-dom";
import ProjectStats from "./components/projectstats";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Login from "./pages/login";
import AccountPage from "./pages/account";
import ProtectedRoute from "./components/protectedroute";
import { useEffect, useState } from "react";
import { account } from "./lib/appwrite";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuthStatus() {
    try {
      // If successful, user is authenticated
      const user = await account.get();
      console.log("User is authenticated:", user);
      // Proceed with your authenticated app flow
      return user;
    } catch (error) {
      console.error("User is not authenticated:", error);
      // Redirect to login page or show login UI
      // window.location.href = '/login';
      return null;
    }
  }

  useEffect(() => {
    async function fetchSession() {
      try {
        const sessionUser = await account.get();
        setUser(sessionUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
    checkAuthStatus();
  }, []);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
