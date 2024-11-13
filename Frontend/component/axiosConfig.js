import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://1cde-103-130-91-93.ngrok-free.app',
  timeout: 5000, // Set a timeout for the request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;