import React, { useState, useEffect } from 'react';
import { Client, Account, Databases, ID, Query } from 'appwrite';

// --- 1. CONFIGURE YOUR APPWRITE CLIENT ---
// Make sure to replace these with your actual project and collection IDs.
const APPWRITE_PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const PROJECTS_COLLECTION_ID = process.env.VITE_PROJECTS_COLLECTION_ID;
const FEEDBACK_COLLECTION_ID = process.env.VITE_FEEDBACK_COLLECTION_ID; // Though not used in frontend, good to have
const FUNCTION_ID = process.env.VITE_APPWRITE_FN_ID;

const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

// This is the base URL for your feedback API function
const FUNCTION_BASE_URL = `${APPWRITE_ENDPOINT}/functions/${FUNCTION_ID}/executions`;

// --- Basic Styling ---
const styles = `
  body { font-family: sans-serif; background: #f0f2f5; color: #333; margin: 0; padding: 2rem; }
  .container { max-width: 800px; margin: auto; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
  .modal-content { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 600px; }
  h1, h2, h3 { color: #111; }
  input, button { padding: 0.8rem; margin: 0.5rem 0; border: 1px solid #ddd; border-radius: 4px; width: calc(100% - 1.6rem); font-size: 1rem; }
  button { background: #007bff; color: white; border: none; cursor: pointer; }
  button:hover { background: #0056b3; }
  .btn-secondary { background: #6c757d; }
  .btn-danger { background: #dc3545; }
  .error { color: #dc3545; margin-bottom: 1rem; }
  ul { list-style: none; padding: 0; }
  li { background: #f9f9f9; border: 1px solid #eee; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
  .feedback-item { border-left: 3px solid #007bff; padding-left: 1rem; }
  .api-url { background: #e9ecef; padding: 0.5rem; border-radius: 4px; font-family: monospace; word-break: break-all; }
`;

// --- The Main App Component ---
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Check for user session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        // Not logged in
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Fetch projects when user logs in
  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        const response = await databases.listDocuments(
          APPWRITE_DATABASE_ID,
          PROJECTS_COLLECTION_ID,
          [Query.equal('ownerId', user.$id)]
        );
        setProjects(response.documents);
      };
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [user]);

  const handleLogout = async () => {
    await account.deleteSession({
      sessionId: 'current'
    });
    setUser(null);
  };
  
  if (isLoading) {
    return <div className="container"><h1>Loading...</h1></div>;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        {user ? (
          <Dashboard
            user={user}
            projects={projects}
            setProjects={setProjects}
            setSelectedProject={setSelectedProject}
            handleLogout={handleLogout}
          />
        ) : (
          <Login setUser={setUser} />
        )}
      </div>
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      )}
    </>
  );
}

// --- Login & Signup Component ---
function Login({ setUser }) {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSigningUp) {
        await account.create(ID.unique(), email, password, name);
      }
      await account.createEmailSession(email, password);
      const loggedInUser = await account.get();
      setUser(loggedInUser);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  return (
    <>
      <h1>{isSigningUp ? 'Create Account' : 'Welcome Back!'}</h1>
      <p>Your personal dashboard for project feedback links.</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {isSigningUp && (
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isSigningUp ? 'Sign Up' : 'Log In'}</button>
      </form>
      <button className="btn-secondary" onClick={() => setIsSigningUp(!isSigningUp)}>
        {isSigningUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
      </button>
    </>
  );
}

// --- Logged-in Dashboard Component ---
function Dashboard({ user, projects, setProjects, setSelectedProject, handleLogout }) {
  const [newProjectName, setNewProjectName] = useState('');

  const addProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      const newProject = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        ID.unique(),
        { name: newProjectName, ownerId: user.$id }
      );
      setProjects([...projects, newProject]);
      setNewProjectName('');
    } catch (err) {
      alert('Error adding project: ' + err.message);
    }
  };
  
  const deleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await databases.deleteDocument(APPWRITE_DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
      setProjects(projects.filter(p => p.$id !== projectId));
    } catch (err) {
      alert('Error deleting project: ' + err.message);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {user.name}!</h1>
        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
      <h2>My Projects</h2>
      <form onSubmit={addProject}>
        <input
          type="text"
          placeholder="New project name..."
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <button type="submit">Add Project</button>
      </form>
      <ul>
        {projects.length > 0 ? projects.map(project => (
          <li key={project.$id}>
            <span>{project.name}</span>
            <div>
              <button onClick={() => setSelectedProject(project)}>View Details</button>
              <button className="btn-danger" onClick={() => deleteProject(project.$id)}>Delete</button>
            </div>
          </li>
        )) : <p>You have no projects yet. Add one above!</p>}
      </ul>
    </>
  );
}

// --- Project Details Modal Component ---
function ProjectModal({ project, setSelectedProject }) {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = `${FUNCTION_BASE_URL}/projects/${project.$id}`;

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.ok) {
          setFeedback(data);
        } else {
          throw new Error(data.error || 'Failed to fetch feedback.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedback();
  }, [apiUrl]);

  return (
    <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{project.name}</h2>
        <h3>Your Public Feedback API URL</h3>
        <p>Users can POST feedback to this URL:</p>
        <p className="api-url">{apiUrl}</p>
        <hr />
        <h3>Received Feedback</h3>
        {isLoading ? <p>Loading feedback...</p> : (
          <ul>
            {feedback.length > 0 ? feedback.map(fb => (
              <li key={fb.$id} className="feedback-item">
                <p><strong>Rating: {'⭐'.repeat(fb.rating)}</strong></p>
                <p>{fb.feedbackText}</p>
              </li>
            )) : <p>No feedback received yet.</p>}
          </ul>
        )}
        <button className="btn-secondary" onClick={() => setSelectedProject(null)}>Close</button>
      </div>
    </div>
  );
}

export default App;