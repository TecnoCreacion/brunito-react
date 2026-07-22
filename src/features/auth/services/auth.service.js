import axiosInstance from "@/lib/axios";
import { api } from "@/lib/api";

export const authService = {
    // 1. Pedir la cookie de protección a Laravel (No usa /api, va a la raíz)
    initCsrf: async () => {
        // Asumiendo que tu VITE_API_URL es http://localhost:8000/api
        // Necesitamos apuntar a http://localhost:8000/sanctum/csrf-cookie
        const baseUrl = import.meta.env.VITE_API_URL.replace("/api/v2", "");
        await axiosInstance.get(`${baseUrl}/sanctum/csrf-cookie`);
    },

    // 2. Enviar credenciales
    login: async (credentials) => {
        await authService.initCsrf();
        // El login normal de Laravel suele estar fuera del prefijo /api, pero depende de tu api.php.
        // Si usas rutas web para login, quita el '/api' de la URL.
        // Asumiremos que creaste un endpoint POST /api/login en Laravel.
        const response = await api.post("/login", credentials);
        return response.data.data;
    },

    // 3. Cerrar sesión
    logout: async () => {
        await api.post("/logout");
    },

    // 4. Obtener el usuario actual (Para saber si la sesión sigue activa al recargar la página)
    getProfile: async () => {
        const response = await api.get("/user");
        return response.data.data;
    },
};
