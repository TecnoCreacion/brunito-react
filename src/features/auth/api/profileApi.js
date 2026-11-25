import { apiClient } from "@/config/axios";

export const profileApi = {
    getProfile: () => apiClient.get("/profile"),
    updateProfile: (payload) => apiClient.put("/profile", payload),
    updatePassword: (payload) => apiClient.put("/profile/password", payload),
};
