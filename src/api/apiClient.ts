import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Axios 요청 인터셉터 (Access Token 자동 추가)
apiClient.interceptors.request.use((config) => {
  if (config.url?.includes("/api/v1/auth/kakao") || config.url?.includes('/api/v1/auth/refresh')) {
    delete config.headers.Authorization;
  } else {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Axios 응답 인터셉터 (Access Token 만료 처리)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      // Access Token 만료 (401, 403) 처리
      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;
  
        // 이미 리프레시 중이면 구독으로 처리
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshSubscribers.push((newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            });
          });
        }
  
        isRefreshing = true;
  
        try {
          const response = await apiClient.post("/api/v1/auth/refresh");
          const newAccessToken = response.data.data.accessToken;
          
          // Access Token 저장
          localStorage.setItem("access_token", newAccessToken);
          isRefreshing = false;
          notifySubscribers(newAccessToken);
  
          // 원래 요청 다시 실행
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          localStorage.removeItem("access_token");
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );
  
  // Refresh Token으로 새로운 Access Token 구독 처리
  const notifySubscribers = (newToken: string) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
  };

export default apiClient;
