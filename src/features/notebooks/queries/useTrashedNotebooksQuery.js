import { useQuery } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "./notebooksKeys";

export const useTrashedNotebooksQuery = ({ userId = null, enabled = false } = {}) => {
    return useQuery({
        queryKey: notebooksKeys.trashed(userId),
        queryFn: () => notebooksService.getTrashed(userId),
        enabled: enabled && !!userId, // Solo consulta a Laravel cuando el usuario abre la papelera
    });
};
