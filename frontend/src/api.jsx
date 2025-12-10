import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // required for cookies
});

// -----------------------
// CSRF helper
// -----------------------
export const getCsrfCookie = async () => {
  const response = await api.get("/sanctum/csrf-cookie");
  console.log("CSRF cookie:", response.headers);
  return response;
};

// -----------------------
// Get XSRF header from cookie
// -----------------------
export const getXsrfHeader = () => {
  const xsrfToken = document.cookie
    .split("; ")
    .find(row => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
  return xsrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) } : {};
};

// -----------------------
// Generic CSRF-protected request helper
// -----------------------
export const csrfRequest = async (method, url, data = {}) => {
  await getCsrfCookie(); // refresh CSRF cookie
  const headers = getXsrfHeader();
  return api.request({ method, url, data, headers });
};

// -----------------------
// Auth
// -----------------------
export const login = async (data) => csrfRequest("post", "/login", data);
export const logout = async () => csrfRequest("post", "/logout");

// -----------------------
// Register
// -----------------------
export const register = async (data) => csrfRequest("post", "/api/register", data);

// -----------------------
// User
// -----------------------
export const fetchUser = async () => api.get("/user"); // GET doesn't need CSRF

export default api;
