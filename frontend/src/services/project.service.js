import { fetchWrapper } from '../helpers/fetch-wrapper';
import {BehaviorSubject} from "rxjs";

const baseUrl = "http://localhost:3000/api/v1";

const createdProjectSubject = new BehaviorSubject();

export const projectService = {
  getAllProjects,
  getProject,
  deleteProject,
  getAllDocuments,
  getDocumentById,
  getFileOfDocument,
  createProject,
  updateProject,
  createDocument,
  deleteDocument,
  saveFile,
  getTranscriptionWords,
  getTranscriptionFulltext,
  updateTranscription,
  startTranskriptionJob
};

function getAllProjects() {
  return  fetchWrapper.get(`${baseUrl}/projects`)
}

function getProject(projectId) {
  return fetchWrapper.get(`${baseUrl}/projects/${projectId}`);
}

function deleteProject(projectId) {
  return fetchWrapper.delete(`${baseUrl}/projects/${projectId}`);
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

function createProject(projectData) {
  return fetchWrapper.post(`${baseUrl}/projects`, 'application/json', JSON.stringify(projectData))
}

function updateProject(projectId, projectData) {
  return fetchWrapper.put(`${baseUrl}/projects/${projectId}`, JSON.stringify(projectData))
}

function createDocument(projectId, documentData) {
  return fetchWrapper.post(`${baseUrl}/projects/${projectId}/docs/`, 'application/json', JSON.stringify(documentData))
}

function deleteDocument(projectId, documentId) {
  return fetchWrapper.delete(`${baseUrl}/projects/${projectId}/docs/${documentId}`)
}

function saveFile(projectId, documentId, file) {
  return fetchWrapper.postFile(`${baseUrl}/projects/${projectId}/docs/${documentId}/file`, file)

}

function getTranscriptionWords(projectId, documentId) {
  return fetchWrapper.get(`${baseUrl}/projects/${projectId}/docs/${documentId}/words`)
}

function getTranscriptionFulltext(projectId, documentId) {
  return fetchWrapper.get(`${baseUrl}/projects/${projectId}/docs/${documentId}/fulltext`)
}

function updateTranscription(projectId, documentId, transcriptionData) {
  return fetchWrapper.post(`${baseUrl}/projects/${projectId}/docs/${documentId}/words`, 'application/json', JSON.stringify(transcriptionData))
}

function startTranskriptionJob(projectId, documentId) {
  return fetchWrapper.post(`${baseUrl}/infer/${projectId}/docs/${documentId}`)
}
