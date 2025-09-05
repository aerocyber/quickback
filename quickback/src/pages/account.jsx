import { useEffect, useState } from "react";
import { Account, Client } from "appwrite";
import {
  getProjectsOfUser,
  deleteProjectRow,
} from "../lib/crud"; // adjust path

import { account } from "../lib/appwrite"; // adjust path

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user + projects
  useEffect(() => {
    async function load() {
      try {
        const u = await account.get();
        setUser(u);

        const projs = await getProjectsOfUser(u.$id);
        setProjects(projs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLogout = async () => {
    await account.deleteSession({
        sessionId: "current",
    });
    setUser(null);
    window.location.href = "/"; // redirect
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }
    try {
      // delete all projects first
      for (const proj of projects) {
        await deleteProjectRow(proj.$id);
      }
      // then delete user account
      await account.delete();
      window.location.href = "/";
    } catch (err) {
      console.error("Delete account failed", err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await deleteProjectRow(id);
    setProjects((prev) => prev.filter((p) => p.$id !== id));
  };

  if (loading) return <div className="p-6">Loading account...</div>;
  if (!user) return <div className="p-6">Not logged in</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Account</h1>

      <div className="bg-white shadow rounded p-4 mb-6">
        <p><strong>Name:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.$id}</p>
      </div>

      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Projects ({projects.length})
        </h2>
        {projects.length === 0 ? (
          <p className="text-gray-600">No projects yet.</p>
        ) : (
          <ul className="divide-y">
            {projects.map((proj) => (
              <li key={proj.$id} className="flex justify-between items-center py-2">
                <span>{proj.name}</span>
                <div className="relative">
                  <details className="inline-block">
                    <summary className="cursor-pointer px-2 py-1 bg-gray-200 rounded text-sm">
                      Options
                    </summary>
                    <div className="absolute right-0 mt-1 w-32 bg-white border shadow rounded">
                      <button
                        onClick={() => handleDeleteProject(proj.$id)}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Logout
        </button>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
