import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import HomeUser from "./pages/HomeUser";
import HomeGuest from "./pages/HomeGuest";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AccountPage from "./pages/account";
import { useAuth } from "./context/authcontext";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        {/* Show different home depending on login */}
        <Route path="/" element={user ? <HomeUser /> : <HomeGuest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={user ? <AccountPage /> : <Login />} />
      </Routes>
    </>
  );
}
