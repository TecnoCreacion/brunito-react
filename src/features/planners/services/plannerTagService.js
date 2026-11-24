import { apiClient } from "@/config/axios";
import { plannerTagApi } from "../api/plannerTagApi";
import { plannerTagAdapter } from "../adapters/plannerTagAdapter";

const unwrapPayload = (axiosResponse) => {
    const body = axiosResponse?.data ?? axiosResponse;
    // Soporta { success: true, data: ... } y respuestas paginadas { data: { data: [...] } }
    if (body?.data?.data && Array.isArray(body.data.data)) return body.data.data;

    if (body?.data !== undefined) return body.data;

    return body;
};

export const plannerTagService = {
    getAll: async () => {
        const response = await apiClient.post(plannerTagApi.getAll);
        const rawList = unwrapPayload(response);

        if (!Array.isArray(rawList)) return [];

        return rawList.map(plannerTagAdapter.toFrontend).filter(Boolean);
    },

    create: async (formData) => {
        const payload = plannerTagAdapter.toBackend(formData);
        const response = await apiClient.post(plannerTagApi.create, payload);
        const rawItem = unwrapPayload(response);

        return plannerTagAdapter.toFrontend(rawItem);
    },

    update: async (id, formData) => {
        const payload = plannerTagAdapter.toBackend(formData);
        const response = await apiClient.patch(`${plannerTagApi.update}${id}`, payload);
        const rawItem = unwrapPayload(response);

        return plannerTagAdapter.toFrontend(rawItem);
    },
};
