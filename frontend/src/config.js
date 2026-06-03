// Centralized backend API base URL.
// Local dev falls back to http://localhost:3000.
// In production (e.g. Render static site) set VITE_API_URL to the deployed backend URL.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Base host (scheme + host, NO port) where per-user dev containers are reachable.
// Each container binds a host port; the app connects to `${CONTAINER_HOST}:${port}`.
// Local dev falls back to http://localhost. For a Docker-host deployment set
// VITE_CONTAINER_HOST to that host's public address, e.g. http://203.0.113.10
export const CONTAINER_HOST = import.meta.env.VITE_CONTAINER_HOST || "http://localhost";
