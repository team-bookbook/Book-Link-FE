import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ERROR_CODES, ERROR_MESSAGES, HTTP_STATUS } from '@constants/http';
import { END_POINT } from '@constants/end-point';
import { getAccessToken, removeAccessToken, setAccessToken } from '@/shared/utils/auth';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  path: string;
}

const handleError = (error: AxiosError<ApiResponse>): ApiError => {
  if (error.response) {
    const responseData = error.response.data;
    const errorData = responseData?.error;

    if (errorData) {
      return {
        timestamp: errorData.timestamp,
        status: errorData.status,
        code: errorData.code,
        message: errorData.message,
        path: errorData.path,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      status: error.response.status,
      code: ERROR_CODES.UNKNOWN,
      message: ERROR_MESSAGES.SERVER_ERROR,
      path: error.config?.url || '',
    };
  } else if (error.request) {
    return {
      timestamp: new Date().toISOString(),
      status: 0,
      code: ERROR_CODES.NETWORK,
      message: ERROR_MESSAGES.NETWORK_ERROR,
      path: error.config?.url || '',
    };
  } else {
    return {
      timestamp: new Date().toISOString(),
      status: 0,
      code: ERROR_CODES.UNKNOWN,
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      path: '',
    };
  }
};

const createHttpClient = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      const res = response.data as ApiResponse;
      if (!res.success) {
        return Promise.reject(res.error);
      }
      response.data = res.data;
      return response;
    },
    async (error: AxiosError<ApiResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      const status = error.response?.status;

      if (status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await instance.post<ApiResponse<string>>(END_POINT.TOKEN_REISSUE, {});
          const newAccessToken = response.data.data;

          if (newAccessToken) {
            setAccessToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          removeAccessToken();
          return Promise.reject(refreshError);
        }
      }

      const apiError = handleError(error);
      return Promise.reject(apiError);
    }
  );

  return instance;
};

const baseURL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_BASE_URL;
export const httpClient = createHttpClient(baseURL);

export async function get<T>(...args: Parameters<typeof httpClient.get>): Promise<T> {
  return httpClient.get<T>(...args).then((res) => res.data);
}

export async function post<T>(...args: Parameters<typeof httpClient.post>): Promise<T> {
  return httpClient.post<T>(...args).then((res) => res.data);
}

export async function patch<T>(...args: Parameters<typeof httpClient.patch>): Promise<T> {
  return httpClient.patch<T>(...args).then((res) => res.data);
}

export async function put<T>(...args: Parameters<typeof httpClient.put>): Promise<T> {
  return httpClient.put<T>(...args).then((res) => res.data);
}

export async function del<T>(...args: Parameters<typeof httpClient.delete>): Promise<T> {
  return httpClient.delete<T>(...args).then((res) => res.data);
}
