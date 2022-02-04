import getConfig from 'next/config';
import {userService} from "../services/user.service";
import { useRouter } from "next/router";

const { publicRuntimeConfig } = getConfig();

import axios, { Axios } from 'axios';

export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
  postFiles
};

function get(url) {
  const requestOptions = {
    headers: authHeader(url)
  };
  return axios.get(url, requestOptions).then(handleResponse);
}

function post(url, contentType, body) {
  const requestOptions = {
    headers: { 'Content-Type': contentType, ...authHeader(url) },
  };
  return axios.post(url, body, requestOptions).then(handleResponse);
}

function postFiles(url, files, docIds) {
  let formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('doc_ids_with_name', JSON.stringify(docIds))
  const requestOptions = {
    headers: { ...authHeader(url) },
  };
  return axios.post(url, formData, requestOptions).then(handleResponse);
}

function put(url, body) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json', ...authHeader(url) },
  };
  return axios.put(url, body, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
  const requestOptions = {
    headers: authHeader(url)
  };
  return axios.delete(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const accessToken = userService.accessTokenValue;
  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` };
  } else {
    return {};
  }
}

function handleResponse(response) {
    /*if (response.status != 200) {
      if ([401, 403].includes(response.status) && userService.userValue) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        userService.logout();
      }
      // navigate to error page
      console.log(response.status)
      const error = (response && response.message) || response.statusText;
      return Promise.reject(error);
    } else {
      return response.data;
    }*/
    return response.data;
}

function handleError(error) {
  return error;
}
