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
  if (
    config.url?.includes("/api/v1/auth/kakao") ||
    config.url?.includes("/api/v1/auth/refresh")
  ) {
    delete config.headers.Authorization;
  } else {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Refresh 구독자들에게 결과 전달
const notifySubscribers = (newToken: string) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};
const notifySubscribersError = (err: any) => {
  refreshSubscribers.forEach((cb) => cb(Promise.reject(err) as any));
  refreshSubscribers = [];
};

// Axios 응답 인터셉터 (Access Token 만료 처리)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // /auth/refresh 요청 자체는 재발급 로직 대상에서 제외
    if (originalRequest.url?.includes("/api/v1/auth/refresh")) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("userId");
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }

    // Access Token 만료 (401, 403) 처리
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 리프레시 중이면 구독자로 등록
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
        const newUserId = response.data.data.userId;

        // Access Token 저장
        localStorage.setItem("access_token", newAccessToken);
        localStorage.setItem("userId", newUserId);
        isRefreshing = false;
        notifySubscribers(newAccessToken);

        // 원래 요청 다시 실행
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        notifySubscribersError(refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("userId");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
