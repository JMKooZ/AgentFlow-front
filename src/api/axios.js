import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    saveTokens,
    clearTokens,
} from "../utils/token";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (resolve, reject) => {
    refreshSubscribers.push({ resolve, reject });
};

const onRefreshed = (accessToken) => {
    refreshSubscribers.forEach(({ resolve }) => {
        resolve(accessToken);
    });

    refreshSubscribers = [];
};

const onRefreshFailed = (error) => {
    refreshSubscribers.forEach(({ reject }) => {
        reject(error);
    });

    refreshSubscribers = [];
};

api.interceptors.response.use(
    (response) => response,

    async(error) => {
        const originalRequest = error.config;
        // const status = error.response ? .status;
        const status = error.response && error.response.status;

        // originalRequest ? ._retry

        if (
            (status !== 401 && status !== 403) ||
            (originalRequest && originalRequest._retry)
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            clearTokens();
            window.location.href = "/login";

            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribeTokenRefresh(resolve, reject);
            }).then((accessToken) => {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            });
        }

        isRefreshing = true;

        try {
            const response = await axios.post("/api/auth/refresh", {
                refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            saveTokens(accessToken, newRefreshToken || refreshToken);

            onRefreshed(accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            onRefreshFailed(refreshError);

            clearTokens();
            window.location.href = "/login";

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export default api;