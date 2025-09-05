import { db } from './appwrite';
import { ID, Query, Permission, Role } from 'appwrite';

const DB_ID = import.meta.env.DB_ID;
const PROJECT_TABLE_ID = import.meta.env.PROJECT_TABLE_ID;
const FEEDBACK_TABLE_ID = import.meta.env.FEEDBACK_TABLE_ID;
const WIDGET_STYLE_TABLE_ID = import.meta.env.WIDGET_STYLE_TABLE_ID;

// Project CRUD
async function createProjectRecord(projectName, projectOwnerId) {
    try {
        return await db.createRow(
            {
                databaseId: DB_ID,
                tableId: PROJECT_TABLE_ID,
                rowId: ID.unique(),
                data: {
                    name: projectName,
                    ownerId: projectOwnerId,
                },
                permissions: [
                    Permission.read(Role.user(projectOwnerId)),
                    Permission.update(Role.user(projectOwnerId)),
                    Permission.delete(Role.user(projectOwnerId))
                ]
            }
        );
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

async function getProjectDetails(projectId) {
    try {
        // const resp = await db.listRows({
        //     databaseId: DB_ID,
        //     tableId: PROJECT_TABLE_ID,
        //     queries: [
        //         Query.equal('$id', projectId),
        //         Query.limit(1)
        //     ]
        // });
        // return resp.rows.length > 0 ? resp.rows[0] : [];
        return await db.getRow({
            databaseId: DB_ID,
            tableId: PROJECT_TABLE_ID,
            rowId: projectId
        });
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

async function getProjectsOfUser(userId) {
    try {
        const resp = await db.listRows({
            databaseId: DB_ID,
            tableId: PROJECT_TABLE_ID,
            queries: [
                Query.equal('ownerId', userId)
            ]
        });
        return resp.rows;
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

async function deleteProjectRow(rowId) {
    try {
        return await db.deleteRow({
            databaseId: DB_ID,
            tableId: PROJECT_TABLE_ID,
            rowId: rowId
        });
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

async function updateProjectRow(rowId, newName) {
    try {
        return await db.updateRow({
            databaseId: DB_ID,
            tableId: PROJECT_TABLE_ID,
            rowId: rowId,
            data: {
                name: newName
            }
        });
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

// Feedback CRUD
async function addFeedBack(projectId, feedback) {
    try {
        return await db.createRow({
            databaseId: DB_ID,
            tableId: FEEDBACK_TABLE_ID,
            rowId: ID.unique(),
            data: {
                projectId: projectId,
                feedback: feedback
            },
            permissions: [
                Permission.read(Role.user(projectId)),
                Permission.update(Role.user(projectId)),
                Permission.delete(Role.user(projectId))
            ]
        });
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

async function getFeedbacks(projectId) {
    try {
        const resp = await db.listRows({
            databaseId: DB_ID,
            tableId: FEEDBACK_TABLE_ID,
            queries: [
                Query.equal('projectId', projectId)
            ]
        });
        return resp.rows;
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

async function deleteFeedback(feedbackId) {
    try {
        return await db.deleteRow({
            databaseId: DB_ID,
            tableId: FEEDBACK_TABLE_ID,
            rowId: feedbackId
        });
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

async function updateFeedback(feedbackId, newFeedback) {
    try {
        return await db.updateRow({
            databaseId: DB_ID,
            tableId: FEEDBACK_TABLE_ID,
            rowId: feedbackId,
            data: {
                feedback: newFeedback
            }
        });
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

// Widget Style CRUD
async function createWidgetStyle(projectId, style) {
    try {
        return await db.createRow({
            databaseId: DB_ID,
            tableId: WIDGET_STYLE_TABLE_ID,
            rowId: ID.unique(),
            data: {
                projectId: projectId,
                style: style
            }
        });
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

async function getWidgetStyle(projectId) {
    try {
        const resp = await db.listRows({
            databaseId: DB_ID,
            tableId: WIDGET_STYLE_TABLE_ID,
            queries: [
                Query.equal('projectId', projectId)
            ]
        });
        return resp.rows;
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

async function updateWidgetStyle(projectId, style) {
    try {
        return await db.updateRow({
            databaseId: DB_ID,
            tableId: WIDGET_STYLE_TABLE_ID,
            rowId: projectId,
            data: {
                style: style
            }
        });
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}   

async function deleteWidgetStyle(projectId) {
    try {
        return await db.deleteRow({
            databaseId: DB_ID,
            tableId: WIDGET_STYLE_TABLE_ID,
            rowId: projectId
        });
    } catch (error) {
        console.error(error);
        if (error.code == 404) return null;
        throw error;
    }
}

export {
    createProjectRecord,
    getProjectDetails,
    getProjectsOfUser,
    deleteProjectRow,
    updateProjectRow,
    addFeedBack,
    getFeedbacks,
    deleteFeedback,
    updateFeedback,
    createWidgetStyle,
    getWidgetStyle,
    updateWidgetStyle,
    deleteWidgetStyle
};