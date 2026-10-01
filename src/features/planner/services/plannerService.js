import { apiClient } from "@/config/axios";
import { plannerApi } from "../api/plannerApi";

export const plannerService = {
    getPlanners: async (userId) => {
        const response = await apiClient.post(plannerApi.getPlanners, {
            with: ["tags"],
            where: {
                user_id: userId,
            },
            orderBy: {
                start_date: "ASC",
            },
        });

        return response.data.data || response.data;
    },

    create: async (data) => {
        const response = await apiClient.post(plannerApi.create, data);

        return response.data;
    },

    update: async (plannerId, data) => {
        const response = await apiClient.put(`${plannerApi.update}/${plannerId}`, data);

        return response.data;
    },

    /**
     * Obtiene las tareas fijas del mes para un usuario.
     */
    getFixedTasks: async (userId) => {
        // Delegamos a Laravel la responsabilidad de filtrar por usuario si es necesario
        const { data } = await apiClient.post(plannerApi.getFixedTasks, {
            with: ["rules"],
            where: { user_id: userId },
        });

        // Retornamos únicamente la data limpia (Adapter conceptual implícito)
        return data.data;
    },

    createFixedTask: async (data) => {
        const response = await apiClient.post(plannerApi.createFixedTask, data);

        return response.data;
    },

    updateFixedTask: async (id, data) => {
        const response = await apiClient.patch(`${plannerApi.updateFixedTask}/${id}`, data);

        return response.data;
    },

    /**
     * Obtiene todas las etiquetas disponibles para el usuario/sistema.
     */
    getTags: async () => {
        const { data } = await apiClient.post(plannerApi.getTags);

        return data.data;
    },
};
