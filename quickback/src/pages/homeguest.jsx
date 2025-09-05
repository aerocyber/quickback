import { Link } from "react-router-dom";

export default function HomeGuest() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to QuickBack</h1>
      <p className="text-lg mb-6">Manage your projects seamlessly.</p>
      <div>
        <Link to="/login" className="text-blue-500 hover:underline">
          Get Started
        </Link>
      </div>
    </div>
  );
}
