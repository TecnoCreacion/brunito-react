import { useQuery } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useTrashedNotebooksQuery = ({ enabled = false } = {}) => {
    return useQuery({
        queryKey: notebooksKeys.trashed(),
        queryFn: notebooksService.getTrashed,
        enabled, // Solo consulta a Laravel cuando el usuario abre la papelera
    });
};
