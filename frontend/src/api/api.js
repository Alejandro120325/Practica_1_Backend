import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const endpoints = {
  health: "/misitio/health",
  gastos: "/misitio/gastos",
  usuarios: "/misitio/usuarios",
};

