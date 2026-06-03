// Centralized backend API base URL.
// Local dev falls back to http://localhost:3000.
// In production (e.g. Render static site) set VITE_API_URL to the deployed backend URL.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
