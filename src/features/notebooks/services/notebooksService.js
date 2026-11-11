import { apiClient } from "@/config/axios";
import { notebookAdapter, notebooksAdapter } from "../adapters/notebookAdapter";

const normalizeWith = (customWith) => {
    // Null o undefined
    if (customWith == null) return {};

    // String: "user" -> { user: true }
    if (typeof customWith === "string") {
        return customWith.trim() ? { [customWith.trim()]: true } : {};
    }

    // Array: ["user", "roles"] -> { user: true, roles: true }
    if (Array.isArray(customWith)) {
        return customWith.reduce(
            (acc, relation) => ({
                ...acc,
                ...normalizeWith(relation),
            }),
            {},
        );
    }

    // Objetos
    if (typeof customWith === "object") {
        return Object.entries(customWith).reduce((acc, [key, value]) => {
            if (!key.trim()) return acc;

            // Normalizar relaciones anidadas
            if (typeof value === "string" || Array.isArray(value)) {
                acc[key] = normalizeWith(value);
            } else {
                acc[key] = value;
            }

            return acc;
        }, {});
    }

    return {};
};

export const notebooksService = {
    /**
     * Obtiene libretas permitiendo filtros personalizados sin exponer la estructura de la API a la UI.
     * @param {Object} customParams - Filtros o parámetros enviados desde el hook/page.
     */
    getAll: async (customParams = {}) => {
        // 🚀 PROTECCIÓN CONTRA NULL: Si customParams es null, usa {}
        const safeParams = customParams ?? {};
        const customWith = normalizeWith(safeParams.with);

        // 🚀 ARQUITECTURA: El servicio construye el payload final protegiendo a la Page de conocer Laravel
        const payload = {
            ...safeParams,

            with: {
                notes: {
                    orderBy: {
                        order: "ASC",
                    },
                },
                ...customWith,
            },
        };

        const response = await apiClient.post("/notebooks/search", payload);

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
        const response = await apiClient.put(`/notebooks/${id}`, payload);

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
