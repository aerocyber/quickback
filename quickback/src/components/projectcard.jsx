import { Link } from "react-router-dom";

export default function ProjectCard({ project, onDelete, onRename }) {
  return (
    <div className="bg-white shadow p-4 rounded hover:shadow-lg">
      <Link to={`/project/${project.$id}`} state={project}>
        <h2 className="text-xl font-bold">{project.name}</h2>
        <p className="text-gray-600">Owner: {project.ownerId}</p>
      </Link>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onRename(project.$id)}
          className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
        >
          Rename
        </button>
        <button
          onClick={() => onDelete(project.$id)}
          className="bg-red-600 text-white px-2 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
