import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://af5c-103-186-233-112.ngrok-free.app',
  timeout: 5000, // Set a timeout for the request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;