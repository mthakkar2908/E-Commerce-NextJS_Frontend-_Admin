import { getStore } from "../redux/storeAccessor";

interface ApiConfig {
  baseURL: string;
  timeout: number;
}

const apiConfig: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api",
  timeout: 10000,
};

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
  }

  private getHeaders(): HeadersInit {
    const state = getStore().getState();
    const token = state.auth.token;

    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const isFormData = options.body instanceof FormData;

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `API Error: ${response.status}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Unknown error occurred");
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const isFormData = body instanceof FormData;

    return this.request<T>(endpoint, {
      method: "POST",
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const isFormData = body instanceof FormData;

    return this.request<T>(endpoint, {
      method: "PUT",
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const isFormData = body instanceof FormData;

    return this.request<T>(endpoint, {
      method: "PATCH",
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, body?: unknown): Promise<T> {
    const isFormData = body instanceof FormData;

    return this.request<T>(endpoint, {
      method: "DELETE",
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient(apiConfig);
