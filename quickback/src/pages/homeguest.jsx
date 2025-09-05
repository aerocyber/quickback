export default function HomeGuest() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to QuickBack</h1>
      <p className="text-lg mb-6">Manage your projects seamlessly.</p>
      <div>
        <a
          href="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4 hover:bg-blue-700"
        >
          Get Started
        </a>
        <a
          href="/login"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Login
        </a>
      </div>
    </div>
  );
}
