import axios from "axios";
import { store } from "../redux/store/store";
import { setCreds } from "../redux/slices/authSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

// 🔄 Refresh state
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

// Process queued requests
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// 🔁 Refresh API
export const refreshAccessToken = async () => {
  try {
    const response = await axiosPublic.get("/refresh", {
      withCredentials: true,
    });

    const data = response.data;
    // setAccessToken(data?.accessToken);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 🔹 REQUEST INTERCEPTOR
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 🔹 RESPONSE INTERCEPTOR (🔥 MAIN LOGIC)
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config;

    if (error.response?.status === 401 && !prevRequest._retry) {
      if (isRefreshing) {
        // 🟡 Add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              prevRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosPrivate(prevRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      prevRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await refreshAccessToken();
        const newAccessToken = data?.accessToken;

        store.dispatch(setCreds({ accessToken: newAccessToken }));

        processQueue(null, newAccessToken);

        prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosPrivate(prevRequest);
      } catch (err) {
        processQueue(err, null);

        // removeAccessToken();
        // 👉 dispatch logout() if using Redux
        // 👉 redirect to login

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
