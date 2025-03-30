import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://9c65-2401-4900-230e-a579-2dcd-dac4-2b09-d70a.ngrok-free.app',
  timeout: 5000, // Set a timeout for the request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
