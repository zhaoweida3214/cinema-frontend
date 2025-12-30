import axios from "axios";

const request = axios.create({
  baseURL: "/api", // 后端地址
  timeout: 10000,
});

// 请求拦截器：自动加 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：处理 401
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default request;
