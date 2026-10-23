import { apiClient } from "@/config/axios";
import { plannerApi } from "../api/plannerApi";
import { plannerFixedTaskListAdapter } from "../adapters/plannerFixedTaskAdapter";

export const plannerService = {
    getPlannerById: async (id, params = {}) => {
        const response = await apiClient.get(`${plannerApi.getPlannerById}/${id}`, { params });

        return response.data.data || response.data;
    },

    getPlanners: async (userId) => {
        const response = await apiClient.post(plannerApi.getPlanners, {
            with: ["tags", "fixedTask"],
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
            with: ["rules", "tags"],
            where: { user_id: userId },
        });

        // Retornamos únicamente la data limpia (Adapter conceptual implícito)
        return plannerFixedTaskListAdapter(data.data);
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

    getResources: async () => {
        const { data } = await apiClient.post(plannerApi.getResources);

        return data.data;
    },

    scheduleTasksForWeek: async (weekNumber, taskIds) => {
        // Enviamos el payload limpio a Laravel: { week_number: 42, task_ids: [1, 2, 2] }
        const response = await apiClient.post(plannerApi.scheduleTasksForWeek, {
            week_number: weekNumber,
            task_ids: taskIds,
        });

        return response.data;
    },
};
