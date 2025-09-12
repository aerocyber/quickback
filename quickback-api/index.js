const sdk = require("node-appwrite");
/**
 * Appwrite function to handle project feedback.
 * - POST /projects/:projectId : Submits new feedback.
 * - GET  /projects/:projectId : Retrieves all feedback for a project.
 */
module.exports = async function (req, res) {
  const client = new sdk.Client();
  const databases = new Databases(client);

  client
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); 

  // 2. Parse the Project ID from the request path
  // This regex matches URLs like "/projects/some-project-id-123"
  const pathRegex = /^\/projects\/([a-zA-Z0-9_.-]+)$/;
  const match = req.path.match(pathRegex);

  if (!match || !match[1]) {
    return res.json({ error: 'Invalid URL format. Expected /projects/:projectId' }, 400);
  }
  const projectId = match[1];

  // HANDLE POST REQUEST (Submit new feedback) ---
  if (req.method === 'POST') {
    try {
      const { rating, feedbackText } = JSON.parse(req.body || '{}');

      // Validate input
      if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5 || !feedbackText || typeof feedbackText !== 'string' || feedbackText.trim() === '') {
        return res.json({ error: 'Invalid input. A rating (number 1-5) and non-empty feedbackText (string) are required.' }, 400);
      }
      
      // Optional but recommended: Verify the project actually exists before adding feedback
      const tablesdb = new sdk.TablesDB(client);

      // Create the new feedback document
      await tablesdb.createRow({
        databaseId: process.env.APPWRITE_DATABASE_ID,
        tableId: process.env.FEEDBACK_TABLE_ID,
        document: {
          projectId: projectId,
          rating: rating,
          feedbackText: feedbackText.trim(),
        }
      });

      return res.json({ success: true, feedback: newFeedback });

    } catch (error) {
      // If the project ID is invalid.
      if (error.code === 404) {
         return res.json({ error: 'Project not found.' }, 404);
      }
      // Handle other potential errors (e.g., Appwrite service issue)
      console.error("Error handling POST request:", error);
      return res.json({ error: 'An internal server error occurred.' }, 500);
    }
  }

  // HANDLE GET REQUEST (Fetch all feedback) ---
  if (req.method === 'GET') {
    try {
      const feedbackList = await tablesdb.listRows({
        databaseId: process.env.APPWRITE_DATABASE_ID,
        tableId: process.env.FEEDBACK_TABLE_ID,
        filters: [Query.equal('projectId', projectId)]
      });

      return res.json(feedbackList.documents);

    } catch (error) {
      console.error("Error handling GET request:", error);
      return res.json({ error: 'An internal server error occurred while fetching feedback.' }, 500);
    }
  }

  // Handle any other HTTP methods
  return res.json({ error: `Method ${req.method} not allowed.` }, 405);
};