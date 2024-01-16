import axios from 'axios';

const http = axios.create({
  baseURL: "http://localhost:yourServerPort", // Replace with your server's port
  headers: {
    "Content-Type": "application/json"
  }
});

export default http;

