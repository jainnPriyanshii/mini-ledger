import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import { ApiResponse, Loan, LoanSummary, User } from "../types";

const TOKEN_KEY = "@mini_ledger_auth_token";
const USER_KEY = "@mini_ledger_auth_user";

class ApiService {
  private token: string | null = null;
  private baseUrl: string = API_BASE_URL;

  constructor() {
    this.loadCachedToken();
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, "");
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async loadCachedToken(): Promise<string | null> {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      this.token = storedToken;
      return storedToken;
    } catch {
      return this.token;
    }
  }

  async getCachedUser(): Promise<User | null> {
    try {
      const rawUser = await AsyncStorage.getItem(USER_KEY);
      if (rawUser) {
        return JSON.parse(rawUser) as User;
      }
    } catch {}
    return null;
  }

  async setAuth(token: string, user: User): Promise<void> {
    this.token = token;
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn("Could not save auth to storage:", e);
    }
  }

  async clearAuth(): Promise<void> {
    this.token = null;
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn("Could not remove auth from storage:", e);
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({
        success: false,
        error: `Server returned invalid response (Status ${response.status})`,
      }));

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `Request failed with status ${response.status}`,
        };
      }

      return data;
    } catch (err: any) {
      if (err.name === "AbortError") {
        return {
          success: false,
          error: "Connection timed out. Check that backend is running and URL is reachable.",
        };
      }
      return {
        success: false,
        error:
          err.message ||
          "Network request failed. Ensure your backend server is running.",
      };
    }
  }

  // Auth Endpoints
  async sendOtp(phone: string): Promise<ApiResponse> {
    return this.request("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOtp(phone: string, otp: string): Promise<ApiResponse> {
    const res = await this.request<{ token: string; user: User }>(
      "/api/auth/verify-otp",
      {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
      }
    );

    if (res.success && res.token && res.user) {
      await this.setAuth(res.token, res.user);
    }

    return res;
  }

  // Loan Endpoints
  async getLoans(): Promise<ApiResponse<{ loans: Loan[] }>> {
    return this.request("/api/loans", { method: "GET" });
  }

  async createLoan(loanData: {
    friend_name: string;
    amount: number;
    due_date: string;
  }): Promise<ApiResponse<{ loan: Loan }>> {
    return this.request("/api/loans", {
      method: "POST",
      body: JSON.stringify(loanData),
    });
  }

  async repayLoan(loanId: string): Promise<ApiResponse<{ loan: Loan }>> {
    return this.request(`/api/loans/${loanId}/repay`, {
      method: "PATCH",
    });
  }

  async getSummary(): Promise<ApiResponse<{ summary: LoanSummary }>> {
    return this.request("/api/loans/summary", { method: "GET" });
  }
}

export const api = new ApiService();
