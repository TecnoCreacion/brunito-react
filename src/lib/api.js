import axiosInstance from "./axios";

/**
 * Capa de abstracción para consumir la API de forma limpia.
 * Soporta todos los verbos HTTP de Laravel.
 */
export const api = {
    // GET: Mapea tu segundo argumento directamente a los "params" de Axios
    get: (url, params = {}, config = {}) => {
        return axiosInstance.get(url, { params, ...config });
    },

    // POST: Envía datos en el cuerpo de la petición
    post: (url, data = {}, config = {}) => {
        return axiosInstance.post(url, data, config);
    },

    // PUT: Para actualizaciones completas
    put: (url, data = {}, config = {}) => {
        return axiosInstance.put(url, data, config);
    },

    // PATCH: Para actualizaciones parciales (Muy usado en Laravel)
    patch: (url, data = {}, config = {}) => {
        return axiosInstance.patch(url, data, config);
    },

    // DELETE: Para eliminar registros
    delete: (url, config = {}) => {
        return axiosInstance.delete(url, config);
    },
};
