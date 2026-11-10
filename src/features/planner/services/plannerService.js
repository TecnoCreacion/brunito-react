import { apiClient } from "@/config/axios";
import { plannerApi } from "../api/plannerApi";
// 🚀 ARQUITECTURA: Importación de Adapters corporativos para blindar la Capa 5
import { plannerCalendarAdapter, plannerListAdapter } from "../adapters/plannerCalendarAdapter";
import { plannerFixedTaskAdapter, plannerFixedTaskListAdapter } from "../adapters/plannerFixedTaskAdapter";

export const plannerService = {
    /**
     * Obtiene el detalle de un evento por ID y lo adapta al modelo del Frontend.
     */
    getPlannerById: async (id, params = {}) => {
        const response = await apiClient.get(`${plannerApi.getPlannerById}/${id}`, { params });
        const rawData = response.data.data || response.data;

        // 🚀 ADAPTER: Transformación de la entidad individual
        return plannerCalendarAdapter(rawData);
    },

    /**
     * Obtiene el listado completo de eventos para el calendario.
     */
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
        const rawData = response.data.data || response.data;

        // 🚀 ADAPTER: Transformación del listado para react-big-calendar
        return plannerListAdapter(rawData);
    },

    /**
     * Crea un nuevo evento en el Planner.
     */
    create: async (data) => {
        const response = await apiClient.post(plannerApi.create, data);
        const rawData = response.data.data || response.data;

        // 🚀 ADAPTER: Mantiene la coherencia de datos retornados tras la mutación
        return plannerCalendarAdapter(rawData);
    },

    /**
     * Actualiza un evento existente.
     */
    update: async (plannerId, data) => {
        const response = await apiClient.put(`${plannerApi.update}/${plannerId}`, data);
        const rawData = response.data.data || response.data;

        return plannerCalendarAdapter(rawData);
    },

    /**
     * Obtiene las tareas fijas del mes adaptadas para la SidebarWidget.
     */
    getFixedTasks: async (userId) => {
        const { data } = await apiClient.post(plannerApi.getFixedTasks, {
            with: ["rules", "tags"],
            where: { user_id: userId },
        });
        const rawData = data.data || data;

        return plannerFixedTaskListAdapter(rawData);
    },

    /**
     * Crea una nueva tarea fija.
     */
    createFixedTask: async (data) => {
        const response = await apiClient.post(plannerApi.createFixedTask, data);
        const rawData = response.data.data || response.data;

        return plannerFixedTaskAdapter(rawData);
    },

    /**
     * Actualiza una tarea fija.
     */
    updateFixedTask: async (id, data) => {
        const response = await apiClient.patch(`${plannerApi.updateFixedTask}/${id}`, data);
        const rawData = response.data.data || response.data;

        return plannerFixedTaskAdapter(rawData);
    },

    /**
     * Obtiene todas las etiquetas disponibles (Normalizadas a objetos del Frontend).
     */
    getTags: async () => {
        const { data } = await apiClient.post(plannerApi.getTags);
        const rawTags = data.data || data;

        if (!Array.isArray(rawTags)) return [];

        // 🚀 ADAPTER DEFENSIVO DE TAGS: Garantiza { id, name, color } para la UI y Sidebar
        return rawTags.map((tag) => ({
            id: tag.id || tag.name || String(tag),
            name: tag.name || tag,
            color: tag.color || "primary",
        }));
    },

    /**
     * Obtiene los recursos/columnas para el calendario.
     */
    getResources: async () => {
        const { data } = await apiClient.post(plannerApi.getResources);
        const rawResources = data.data || data;

        if (!Array.isArray(rawResources)) return [];

        return rawResources.map((res) => ({
            id: res.id,
            title: res.title || res.name,
            color: res.color || "primary",
        }));
    },

    /**
     * Agenda masivamente tareas fijas para una semana específica.
     */
    scheduleTasksForWeek: async ({ weekNumber, taskIds, isoYear }) => {
        const payload = {
            week_number: weekNumber,
            task_ids: taskIds,
            iso_year: isoYear || new Date().getFullYear(),
        };

        const { data } = await apiClient.post(plannerApi.scheduleTasksForWeek, payload);

        // Si Laravel responde con el listado de eventos creados/afectados, los adaptamos
        if (Array.isArray(data.data)) {
            return plannerListAdapter(data.data);
        }

        return data;
    },
};
