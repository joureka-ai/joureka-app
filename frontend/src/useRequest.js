import useSWR from "swr"
import {userService} from "./services";

const baseUrl = "/api/v1/";
const fetcher = (url) => fetch(url,{
  headers: {
    Authorization: `Bearer ${userService.accessTokenValue}`,
    'Content-Type': 'application/json',
  },
}).then((res) => res.json());

export const useGetProjects = () => {

  const url = baseUrl + "projects/";

  const { data, error } = useSWR(url, fetcher);

  return { projects: data, error: error }
};

export const useGetProjectById = (pid) => {

  const url = baseUrl + `projects/${pid}`;

  const { data, error } = useSWR(url, fetcher);

  return { project: data, error: error }
};

export const useGetRecordingsForProject = (pid) => {

  const url = baseUrl + `projects/${pid}/docs`;

  const { data, error } = useSWR(url, fetcher);

  return { recordings: data, error: error }
};

export const useGetRecording = (pid, rid) => {
  const url = baseUrl + `projects/${pid}/docs/${rid}`;

  const { data, error } = useSWR(url, fetcher);

  return { recording: data, error: error }
};

export const useGetFileForRecording = (pid, rid) => {
  const url = baseUrl + `projects/${pid}/docs/${rid}/file`;

  const { data, error } = useSWR(url, fetcher);

  return {file: data, error: error};
};
