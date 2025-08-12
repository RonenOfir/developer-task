// src/api/http.ts
import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:3000', // NestJS base URL
  withCredentials: false,
});