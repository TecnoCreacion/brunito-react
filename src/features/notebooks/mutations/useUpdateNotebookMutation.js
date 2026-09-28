import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useUpdateNotebookMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => notebooksService.update(id, data),

        // 🚀 Actualización Optimista para evitar saltos visuales
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: notebooksKeys.lists() });

            const previousNotebooks = queryClient.getQueryData(notebooksKeys.lists());

            queryClient.setQueryData(notebooksKeys.lists(), (old) => {
                if (!old) return [];
                return old.map((notebook) => (notebook.id === id ? { ...notebook, ...data } : notebook));
            });

            return { previousNotebooks };
        },

        onError: (err, variables, context) => {
            if (context?.previousNotebooks) {
                queryClient.setQueryData(notebooksKeys.lists(), context.previousNotebooks);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: notebooksKeys.lists() });
        },
    });
};
