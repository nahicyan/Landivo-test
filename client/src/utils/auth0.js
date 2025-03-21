import { api } from "./api";

export const getAuth0User = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error getting current user:", error);
    return { isAuthenticated: false };
  }
};

export const logoutAuth0 = async () => {
  try {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`;
  } catch (error) {
    console.error("Logout error:", error);
  }
};