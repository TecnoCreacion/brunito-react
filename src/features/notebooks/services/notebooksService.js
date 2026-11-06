import { apiClient } from "@/config/axios";
import { notebookAdapter, notebooksAdapter } from "../adapters/notebookAdapter";

export const notebooksService = {
    getAll: async () => {
        const response = await apiClient.post("/notebooks/search", {
            with: {
                notes: {
                    orderBy: {
                        order: "ASC",
                    },
                },
            },
        });

        return notebooksAdapter(response.data.data);
    },

    getById: async (id) => {
        const response = await apiClient.get(`/notebooks/${id}`, {
            params: {
                with: ["notes"],
            },
        });

        return notebookAdapter(response.data.data);
    },

    create: async (payload) => {
        const response = await apiClient.post("/notebooks", payload);

        return notebookAdapter(response.data.data);
    },

    update: async (id, payload) => {
        const response = await apiClient.put(`/notebooks/${id}/edit`, payload);

        return notebookAdapter(response.data.data);
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/notebooks/${id}`);

        return notebookAdapter(response.data.data);
    },

    reorderNotebooks: async (payload) => {
        const response = await apiClient.put("/notebooks/reorder", { order: payload });

        return response.data.data;
    },

    togglePin: async (id, isPinned) => {
        const response = await apiClient.patch(`/notebooks/${id}/pin`, {
            is_pinned: isPinned,
        });

        return notebookAdapter(response.data);
    },
};
