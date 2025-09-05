import { useEffect, useState } from "react";
import ProjectCard from "../components/projectcard";
import {
  getProjectsOfUser,
  createProjectRecord,
  deleteProjectRow,
  updateProjectRow,
} from "../lib/crud"; // adjust path

export default function HomeUser({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects on mount
  useEffect(() => {
    getProjectsOfUser(user.$id)
      .then((res) => setProjects(res || []))
      .finally(() => setLoading(false));
  }, [user.$id]);

  const addProject = async () => {
    const name = prompt("Enter project name:");
    if (!name) return;
    const newProj = await createProjectRecord(name, user.$id);
    setProjects((prev) => [...prev, newProj]);
  };

  const handleDelete = async (id) => {
    await deleteProjectRow(id);
    setProjects((prev) => prev.filter((p) => p.$id !== id));
  };

  const handleRename = async (id) => {
    const newName = prompt("Enter new project name:");
    if (!newName) return;
    const updated = await updateProjectRow(id, newName);
    setProjects((prev) =>
      prev.map((p) => (p.$id === id ? { ...p, name: updated.name } : p))
    );
  };

  if (loading) return <div className="p-6">Loading projects...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {user.name || user.email}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <ProjectCard
            key={proj.$id}
            project={proj}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ))}
      </div>
      <button
        onClick={addProject}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Add New Project
      </button>
    </div>
  );
}
