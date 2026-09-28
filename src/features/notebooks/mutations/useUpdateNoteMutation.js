import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useUpdateNoteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteId, payload }) => notebooksService.updateNote(noteId, payload),
        onSuccess: (_, { notebookId }) => {
            return queryClient.invalidateQueries({ queryKey: notebooksKeys.notes(notebookId) });
        },
    });
};
