import { apiClient } from "@/config/axios";
import { notebooksAdapter } from "../adapters/notebookAdapter";
import { noteAdapter } from "../adapters/noteAdapter";

export const notesService = {
    getNotes: async (id) => {
        const response = await apiClient.get(`/notebook_notes/${id}`);

        return noteAdapter(response.data.data);
    },

    createNote: async (notebookId, payload) => {
        // Arquitectónicamente, si el endpoint no usa notebookId en la URL,
        // asegúrate de que vaya en el payload. Lo dejo como lo tenías.
        const response = await apiClient.post(`/notebook_notes`, payload);

        return noteAdapter(response.data.data);
    },

    updateNote: async (id, payload) => {
        const response = await apiClient.put(`/notebook_notes/${id}`, payload);

        return noteAdapter(response.data.data);
    },

    deleteNote: async (id) => {
        const response = await apiClient.delete(`/notebook_notes/${id}/`);

        return response.data.data;
    },

    reorderNotes: async (id, payload) => {
        const response = await apiClient.put(`/notebooks/${id}/notes/reorder`, { order: payload });
        // Mantengo el notebooksAdapter aquí tal cual lo tenías, asumiendo que
        // tu backend de Laravel devuelve el Notebook completo tras reordenar sus notas.
        return notebooksAdapter(response.data.data);
    },
};
