import axios from 'axios';

export const JWT_TOKEN = 'APP_TOKEN';
export const SERVER_URL = ``;

const authedRequest = axios.create();
authedRequest.interceptors.request.use(function (config) {
  config.url = SERVER_URL + config.url;
  config.headers = {
    Authorization: `Bearer ${localStorage.getItem(JWT_TOKEN)}`,
  }
  return config;
}, function (err) {
  return Promise.reject(err);
});

authedRequest.interceptors.response.use(function (response) {

  return response;
},function (err) {
  return Promise.reject(err);
})



export {
  authedRequest,
}
