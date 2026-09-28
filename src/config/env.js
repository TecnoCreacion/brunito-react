/**
 * Capa de abstracción para variables de entorno.
 * Centraliza los valores por defecto y previene el uso esparcido de import.meta.env
 */
export const ENV = {
    APP_NAME: import.meta.env.VITE_APP_NAME || "BrunOS",
    APP_ENV: import.meta.env.VITE_APP_ENV,
    APP_DEBUG: import.meta.env.VITE_APP_DEBUG || false,

    API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    APP_URL: import.meta.env.VITE_API_URL || "http://localhost:5173",
};
