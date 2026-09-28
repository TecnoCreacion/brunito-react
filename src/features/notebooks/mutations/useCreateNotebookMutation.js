import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useCreateNotebookMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => notebooksService.create(payload),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: notebooksKeys.lists() });
        },
    });
};
