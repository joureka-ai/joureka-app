import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = "http://localhost:3000/api/v1";

export const projectService = {
  getAllProjects,
  getProject,
  getAllDocuments,
  getDocumentById,
  getFileOfDocument
};

function getAllProjects() {
  return  fetchWrapper.get(`${baseUrl}/projects`)
}

function getProject(projectId) {
  return fetchWrapper.get(`${baseUrl}/projects/${projectId}`);
}

function getAllDocuments(projectId) {
  return fetchWrapper.get(`${baseUrl}/projects/${projectId}/docs`);
}

function getDocumentById(projectId, documentId) {
  return fetchWrapper.get(`${baseUrl}/projects/${projectId}/docs/${documentId}`)
}

function getFileOfDocument(projectId, documentId) {
  return fetchWrapper.get(`${baseUrl}/projects/${projectId}/docs/${documentId}/file`)
}
