import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomeUser from "./HomeUser";
import HomeGuest from "./HomeGuest";
import Login from "./login";
import Signup from "./signup";
import AccountPage from "./account";
import { useAuth } from "./authcontext";

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
