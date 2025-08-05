import axios, { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api';
import { useAuthStore } from '@/stores/useAuthStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const redirectHomePage = () => {
  localStorage.removeItem('access_token');
  const clearAuth = useAuthStore.getState().clearAuth;
  clearAuth();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Refresh 구독자들에게 결과 전달
const notifySubscribers = (newToken: string) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};
const notifySubscribersError = () => {
  refreshSubscribers = [];
};

// Axios 요청 인터셉터 (Access Token 자동 추가)
apiClient.interceptors.request.use((config) => {
  const skipAuth =
    config.url?.includes('/api/v1/auth/kakao') ||
    config.url?.includes('/api/v1/auth/guest') ||
    config.url?.includes('/api/v1/auth/refresh');

  if (!skipAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

// Axios 응답 인터셉터 (Access Token 만료 처리)
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답
    return response.data;
  },
  async (error: AxiosError<ApiResponse>) => {
    // 실패 응답
    const originalRequest = error.config as any;
    const status = error.response?.status;
    const errorData = error.response?.data;
    const code = errorData?.code;

    // fallback - 서버응답 없음, 알 수 없는 에러 등
    if (!error.response?.data) {
      return Promise.reject({
        status: 0,
        code: 'NETWORK_ERROR',
        message: error.message || '알 수 없는 네트워크 오류',
        data: null,
        raw: error,
      } as ApiResponse<null>);
    }

    // /auth/refresh 요청 자체는 재발급 로직 대상에서 제외
    if (originalRequest.url?.includes('/api/v1/auth/refresh')) {
      redirectHomePage();
      return Promise.reject(error);
    }

    // ✅ 리프레시 응답 에러 코드
    const refreshTokenErrorCodes = [
      'REFRESH_TOKEN_INVALID',
      'REFRESH_TOKEN_EXPIRED',
      'REFRESH_TOKEN_MISMATCH',
    ];
    if (code && refreshTokenErrorCodes.includes(code)) {
      redirectHomePage();
      return Promise.reject(errorData);
    }

    const isAccessTokenExpired =
      status === 401 && code === 'ACCESS_TOKEN_EXPIRED';
    const isAccessTokenInvalid =
      status === 401 && code === 'ACCESS_TOKEN_INVALID';

    // ✅ 토큰 무효 or 권한 없음
    if (isAccessTokenInvalid) {
      redirectHomePage();
      return Promise.reject(errorData);
    }

    // ✅ 토큰 만료 → 리프레시 시도
    if (isAccessTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

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
        const refreshRes = await apiClient.post<
          ApiResponse<{ accessToken: string; userId: string; role: string }>
        >('/api/v1/auth/refresh');
        const { accessToken, userId, role } = refreshRes.data.data;
        const setAuth = useAuthStore.getState().setAuth;

        localStorage.setItem('access_token', accessToken);
        setAuth(userId, role as 'GUEST' | 'USER');
        isRefreshing = false;
        notifySubscribers(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        isRefreshing = false;
        notifySubscribersError();
        redirectHomePage();
        return Promise.reject(refreshError.response?.data);
      }
    }

    // ✅ 그 외 에러는 react-query에서 처리
    return Promise.reject(errorData);
  }
);

export default apiClient;
