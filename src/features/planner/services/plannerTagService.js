import { plannerTagApi } from "../api/plannerTagApi";
import { plannerTagAdapter } from "../adapters/plannerTagAdapter";

export const plannerTagsService = {
    getAll: async () => {
        const response = await plannerTagApi.getAll();
        const rawList = response.data?.data ?? response.data ?? [];
        return Array.isArray(rawList) ? rawList.map(plannerTagAdapter.toFrontend) : [];
    },

    create: async (formData) => {
        const payload = plannerTagAdapter.toBackend(formData);
        const response = await plannerTagApi.create(payload);
        return plannerTagAdapter.toFrontend(response.data?.data ?? response.data);
    },

    update: async (id, formData) => {
        const payload = plannerTagAdapter.toBackend(formData);
        const response = await plannerTagApi.update(id, payload);
        return plannerTagAdapter.toFrontend(response.data?.data ?? response.data);
    },
};
