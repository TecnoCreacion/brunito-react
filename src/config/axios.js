import axios from "axios";
import qs from "qs";
import { ENV } from "./env"; // Nomenclatura oficial (camelCase para la instancia exportada)

// 1. Instancia Única de Axios
export const apiClient = axios.create({
    baseURL: ENV.API_URL,
    timeout: ENV.TIMEOUT || 10000,

    // Configuración obligatoria para Laravel Sanctum SPA
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },

    // 2. Serializador optimizado para parámetros de Laravel
    paramsSerializer: {
        serialize: (params) => qs.stringify(params, { arrayFormat: "brackets" }),
    },
});

// 1.1 Instancia auxiliar para endpoints de la raíz de Laravel (como Sanctum CSRF)
// Extrae la base del dominio eliminando el sufijo /api si estuviera presente.
const rootBaseURL = ENV.API_URL.replace(/\/api\/?$/, "");

export const sanctumClient = axios.create({
    baseURL: rootBaseURL, // Ej: http://localhost:8000
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

// 3. Interceptor de Peticiones
apiClient.interceptors.request.use(
    (config) => {
        // Al usar Sanctum SPA (Cookies), el navegador gestiona el estado automáticamente.
        // No inyectamos Authorization Bearer manualmente aquí.
        return config;
    },
    (error) => Promise.reject(error),
);

// 4. Interceptor de Respuestas
apiClient.interceptors.response.use(
    (response) => {
        // En BrunOS, los Adapters se encargarán de limpiar el payload de Laravel.
        // Axios simplemente entrega la respuesta HTTP exitosa.
        return response;
    },
    (error) => {
        const status = error.response ? error.response.status : null;

        // Registro técnico para observabilidad (No UI).
        // Nunca mostrar Toast ni Modales desde esta capa.
        if (status === 401) {
            console.warn("[Axios] Sesión expirada o no autorizado.");
        } else if (status === 403) {
            console.warn("[Axios] Prohibido: No tienes permisos para esta acción.");
        } else if (status === 422) {
            console.warn("[Axios] Error de validación de Laravel.");
        } else if (status >= 500) {
            console.error("[Axios] Error crítico en el servidor (Laravel).");
        }

        // Propagamos el error para que la Capa 4 (TanStack Query) o
        // la Capa 3 (Hooks/AuthContext) ejecuten las acciones visuales y de estado.
        return Promise.reject(error);
    },
);
