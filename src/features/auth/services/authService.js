import { apiClient, sanctumClient } from "@/config/axios";
import { AUTH_ENDPOINTS } from "../api/authApi";
import { userAdapter } from "../adapters/userAdapter"; // o authAdapter según tu nombre

export const authService = {
    login: async (credentials) => {
        // 1. Primero pedimos el cookie CSRF de Sanctum (Buenas prácticas de Laravel Sanctum SPA)
        await sanctumClient.get("/sanctum/csrf-cookie");

        // 2. Ejecutamos el login. Laravel establecerá la cookie de sesión automáticamente.
        const { data } = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);

        return data; // Retorna el formato estandarizado { success, message, data }
    },

    logout: async () => {
        const { data } = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
        return data;
    },

    getMe: async () => {
        // Consultamos el usuario actual. Las cookies viajan solas gracias a withCredentials: true
        const { data } = await apiClient.get(AUTH_ENDPOINTS.ME);

        // Asumiendo que data.data trae el usuario de Laravel
        return data.data;
    },

    register: async (credentials) => {
        const { data } = await apiClient.post(AUTH_ENDPOINTS.REGISTER, credentials);

        // Asumiendo que data.data trae el usuario de Laravel
        return data.data;
    },

    forgotPassword: async (email) => {
        const { data } = await apiClient.post(AUTH_ENDPOINTS.FORGOTPASSWORD, email);

        // Asumiendo que data.data trae el usuario de Laravel
        return data.data;
    },
};
