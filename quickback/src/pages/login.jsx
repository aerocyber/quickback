import { OAuthProvider } from "appwrite";

import { account } from "../lib/appwrite";

export default function Login() {
  const handleGithubLogin = () => {
    account.createOAuth2Session({
      provider: OAuthProvider.Github,
      success: "https://quickback.appwrite.network/", // redirect here on success
      failure: "https://quickback.appwrite.network//login", // redirect here on failure
      scopes: ["user"], // scopes (optional)
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to QuickBack</h1>
      <p className="mb-6 text-gray-600">Sign in to continue</p>
      <button
        onClick={handleGithubLogin}
        className="bg-gray-900 text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.6-1.5-1.4-1.9-1.4-1.9-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.3 1.8 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.2 1.9-.3 2.8-.3.9 0 1.9.1 2.8.3 2.3-1.6 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.4 6 .4.3.8 1 .8 2v3c0 .4.2.7.8.6 4.6-1.5 7.9-5.9 7.9-10.9C23.5 5.65 18.35.5 12 .5z" />
        </svg>
        Continue with GitHub
      </button>
    </div>
  );
}
