import axios from "axios";

const mode = import.meta.env.MODE;
const configuredUrl = import.meta.env.VITE_API_URL?.trim();

export const API_URL = configuredUrl || (mode === "aws" ? "http://18.191.247.48:3000" : "http://localhost:3000");

const normalizedUrl = API_URL.toLowerCase();
const isLocalUrl = normalizedUrl.includes("localhost") || normalizedUrl.includes("127.0.0.1");

export const connectionInfo = {
  mode,
  apiUrl: API_URL,
  isAws: mode === "aws" || !isLocalUrl,
};

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 12000,
});

export const endpoints = {
  health: "/misitio/health",
  gastos: "/misitio/gastos",
  usuarios: "/misitio/usuarios",
};
