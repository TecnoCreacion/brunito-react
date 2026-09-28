import { apiClient } from "@/config/axios";

export const notebooksService = {
    // ==========================================
    // 1. NOTEBOOKS (Los tableros visuales)
    // ==========================================

    getAll: async () => {
        const response = await apiClient.post("/notebooks/search", {
            params: {
                with: {
                    notes: {
                        orderBy: {
                            created_at: "desc",
                        },
                    },
                },
            },
        });

        return response.data.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/notebooks/${id}`, {
            params: {
                with: ["notes"],
            },
        });

        return response.data.data;
    },

    create: async (payload) => {
        const response = await apiClient.post("/notebooks", payload);

        return response.data.data;
    },

    update: async (id, payload) => {
        const response = await apiClient.put(`/notebooks/${id}`, payload);

        return response.data.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/notebooks/${id}`);

        return response.data.data;
    },

    // Endpoint crítico para el Drag & Drop del tablero principal
    reorderNotebooks: async (payload) => {
        // payload esperado por Laravel: [{ id: 1, position: 0 }, { id: 2, position: 1 }]
        const response = await apiClient.put("/notebooks/reorder", { order: payload });

        return response.data.data;
    },

    togglePin: async (id, isPinned) => {
        // Hacemos un PATCH enviando el booleano
        const response = await apiClient.patch(`/notebooks/${id}/pin`, {
            is_pinned: isPinned,
        });

        return response.data;
    },

    // ==========================================
    // 2. NOTES (El listado dentro de cada tablero)
    // ==========================================

    getNotes: async (id) => {
        const response = await apiClient.get(`/notebook_notes/${id}/`);

        return response.data.data;
    },

    createNote: async (notebookId, payload) => {
        const response = await apiClient.post(`/notebook_notes`, payload);

        return response.data.data;
    },

    updateNote: async (id, payload) => {
        const response = await apiClient.put(`/notebook_notes/${id}`, payload);

        return response.data.data;
    },

    deleteNote: async (id) => {
        const response = await apiClient.delete(`/notebook_notes/${id}/`);

        return response.data.data;
    },

    // Endpoint para reordenar elementos dentro de una nota específica
    reorderNotes: async (id, payload) => {
        // payload esperado por Laravel: [{ id: 1, order: 0 }, { id: 2, order: 1 }]
        const response = await apiClient.put(`/notebooks/${id}/notes/reorder`, { order: payload });
        return response.data.data;
    },
};
