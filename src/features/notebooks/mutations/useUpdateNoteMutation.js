import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notesService } from "../services/notesService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useUpdateNoteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteId, payload }) => notesService.updateNote(noteId, payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: notebooksKeys.detail(variables.notebookId) });

            queryClient.invalidateQueries({ queryKey: notebooksKeys.lists() });
        },
    });
};
