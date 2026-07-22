import { api } from "@/lib/api";

export const userService = {
    // Buscar usuarios
    getUsers: async (params = {}) => {
        // Axios convertirá esto a /api/users?search=loquesea
        const response = await api.get("/users", params);
        return response.data;
    },
    // Crear usuario
    create: async (data) => {
        const response = await api.post("/users", data);
        return response.data;
    },
    // Actualizar usuario
    update: async ({ id, ...data }) => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },
};
