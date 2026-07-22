import axios from "axios";
import qs from "qs";

// 1. Instancia base de Axios
const axiosInstance = axios.create({
    // Lee la URL base desde tu archivo .env (ej. http://localhost:8000/api)
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v2",

    // CRUCIAL PARA SANCTUM: Permite el envío de cookies de sesión
    withCredentials: true,

    withXSRFToken: true,

    xsrfCookieName: "XSRF-TOKEN",

    xsrfHeaderName: "X-XSRF-TOKEN",

    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },

    // 2. Serializador mágico para Laravel
    // Convierte { with: ['roles'] } en ?with[]=roles
    paramsSerializer: {
        serialize: (params) => qs.stringify(params, { arrayFormat: "brackets" }),
    },
});

// 3. Interceptor de Peticiones (Antes de enviar al servidor)
axiosInstance.interceptors.request.use(
    (config) => {
        // Aquí podrías inyectar un Bearer token si no usaras cookies,
        // pero con Laravel Sanctum (cookies), esto va casi vacío.
        return config;
    },
    (error) => Promise.reject(error),
);

// 4. Interceptor de Respuestas (Cuando Laravel responde)
axiosInstance.interceptors.response.use(
    (response) => response, // Si todo sale bien, devolvemos la data
    (error) => {
        // Manejo centralizado de errores
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            console.error("Sesión expirada o no autorizado.");
            // Aquí luego conectaremos para limpiar el estado del Context y redirigir al login
        } else if (status === 403) {
            console.error("No tienes permisos para esta acción.");
        } else if (status === 422) {
            console.warn("Errores de validación de Laravel.");
        } else if (status >= 500) {
            console.error("Error grave en el servidor (Laravel).");
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
