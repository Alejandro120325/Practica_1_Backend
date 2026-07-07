import axios from "axios";

const API_URL =
    import.meta.env.MODE === "aws"
        ? "http://18.191.247.48:3000"
        : import.meta.env.VITE_API_URL || "http://localhost:3000";

console.log("MODO VITE:", import.meta.env.MODE);
console.log("API_URL usada por el frontend:", API_URL);

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