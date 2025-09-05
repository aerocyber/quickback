import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProjectDetails,
  getFeedbacks,
  addFeedBack,
  deleteFeedback,
} from "../lib/crud"; // adjust path

export default function ProjectStats() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const proj = await getProjectDetails(id);
      const fb = await getFeedbacks(id);
      setProject(proj);
      setFeedbacks(fb || []);
      setLoading(false);
    }
    loadData();
  }, [id]);

  const handleAddFeedback = async () => {
    const msg = prompt("Enter feedback:");
    if (!msg) return;
    const newFb = await addFeedBack(id, msg);
    setFeedbacks((prev) => [...prev, newFb]);
  };

  const handleDeleteFeedback = async (fid) => {
    await deleteFeedback(fid);
    setFeedbacks((prev) => prev.filter((f) => f.$id !== fid));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!project) return <div className="p-6">Project not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <p className="mt-2 text-gray-700">Owner: {project.ownerId}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Feedback</h2>
        <ul className="list-disc pl-6">
          {feedbacks.map((f) => (
            <li key={f.$id} className="flex justify-between items-center">
              <span>{f.feedback}</span>
              <button
                onClick={() => handleDeleteFeedback(f.$id)}
                className="text-red-600 text-sm ml-4"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={handleAddFeedback}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Feedback
        </button>
      </div>
    </div>
  );
}
