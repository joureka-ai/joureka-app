import { BehaviorSubject } from 'rxjs';
import Router from 'next/router';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = "api/v1";
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));
const accessTokenSubject = new BehaviorSubject(process.browser && localStorage.getItem('access-token'));

export const userService = {
  accessToken: accessTokenSubject.asObservable(),
  user: userSubject.asObservable(),
  get accessTokenValue () { return accessTokenSubject.value },
  get userValue () { return userSubject.value },
  login,
  logout,
  getAll
};

function login(username, password) {
  let paramsObj = {username: username, password: password};

  return fetchWrapper.post(`${baseUrl}/login/access-token`, 'application/x-www-form-urlencoded', new URLSearchParams(paramsObj))
    .then(accessToken => {
      localStorage.setItem('access-token', accessToken.access_token);
      accessTokenSubject.next(accessToken.access_token);
      fetchWrapper.get(`${baseUrl}/users/me`).then(user => {
          localStorage.setItem('user', JSON.stringify(user));
          userSubject.next(user)
        });
    });
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.removeItem('user');
  localStorage.removeItem('access-token');
  userSubject.next(null);
  accessTokenSubject.next(null);
  Router.push('/login');
}

function getAll() {
  return fetchWrapper.get(baseUrl);
}
