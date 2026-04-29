import { User } from "@/types/auth";

export const authUtils = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  },
  clearAuth: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("authToken", token);
  },
  setUser: (user: User): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  },
  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
};
