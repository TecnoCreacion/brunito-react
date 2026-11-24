import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../queries/notebooksKeys";

export const useRestoreNotebookMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => notebooksService.restore(id),
        onSuccess: () => {
            // Sincroniza tanto la papelera como el tablero principal
            queryClient.invalidateQueries({ queryKey: notebooksKeys.trashed() });
            queryClient.invalidateQueries({ queryKey: notebooksKeys.lists() });
        },
    });
};
