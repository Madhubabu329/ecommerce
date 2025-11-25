// 🧩 src/utils/api.js (Axios with auto token refresh)
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          { refreshToken }
        );

        localStorage.setItem("accessToken", res.data.accessToken);
        original.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(err);
  }
);

export default api;
