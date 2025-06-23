import axios from "axios";
import { Config } from "../environment";

// Use AbortController instead of deprecated CancelToken
let abortController = new AbortController();

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: Config.URL, // Set base URL from config
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercept request and modify it before sending
axiosInstance.interceptors.request.use(
    async function (config) {
        // Retrieve token from localStorage (for web)
        const token = localStorage.getItem("storeToken");
        const cleanedToken = token?.replace(/^"|"$/g, "");

        // Add Authorization header if token exists
        if (token) {
            config.headers.Authorization = `Bearer ${cleanedToken}`;
        }

        // Remove invalid headers (CORS headers are set by the backend)
        delete config.headers["Access-Control-Allow-Origin"];

        // Cancel the previous request if a new one is made
        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();
        config.signal = abortController.signal;

        console.log("Interceptor Request Config:", config);
        return config;
    },
    function (error) {
        console.error("Request Interceptor Error:", error);
        return Promise.reject(error);
    }
);

// Intercept response and handle errors
axiosInstance.interceptors.response.use(
    function (response) {
        return response.data; // Return only response data
    },
    function (error) {
        console.error("Interceptor Response Error:", error);

        // Handle 401 (Unauthorized)
        if (error?.response?.status === 401) {
            alert("Session Timeout! Your session has expired. Please log in again.");
            // Redirect to login or perform necessary actions
        }

        return Promise.reject(error.response ? error.response.data : error.message);
    }
);

export default axiosInstance;
