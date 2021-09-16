import useSWR from "swr"
import {userService} from "./services";

const baseUrl = "/api/v1/";

export const useGetProjects = () => {

  const url = baseUrl + "projects/";

  const fetcher = (url) => fetch(url,{
    headers: {
      Authorization: `Bearer ${userService.accessTokenValue}`,
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  const { data, error } = useSWR(url, fetcher);

  return { data, error }
};
