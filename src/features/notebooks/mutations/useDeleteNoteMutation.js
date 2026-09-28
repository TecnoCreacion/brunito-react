import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useDeleteNoteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // 1. Recibimos ambos IDs del componente, pero SOLO enviamos noteId a Laravel
        mutationFn: ({ noteId }) => notebooksService.deleteNote(noteId),

        // 🚀 ACTUALIZACIÓN OPTIMISTA
        onMutate: async ({ notebookId, noteId }) => {
            // 2. Usamos notebookId para aislar la cancelación de peticiones
            await queryClient.cancelQueries({ queryKey: notebooksKeys.notes(notebookId) });

            // 3. Guardamos la foto del estado específico de esta libreta
            const previousNotes = queryClient.getQueryData(notebooksKeys.notes(notebookId));

            // 4. Actualizamos la caché local eliminando la nota instantáneamente
            queryClient.setQueryData(notebooksKeys.notes(notebookId), (oldData) => {
                if (!oldData) return oldData;
                return oldData.filter((note) => note.id !== noteId);
            });

            // Retornamos el contexto para rollback
            return { previousNotes, notebookId };
        },

        // Si ocurre un error, restauramos las notas de ESTA libreta
        onError: (err, variables, context) => {
            if (context?.previousNotes) {
                queryClient.setQueryData(notebooksKeys.notes(context.notebookId), context.previousNotes);
            }
        },

        // Re-sincronizamos con el servidor de forma silenciosa, refrescando solo esta libreta
        onSettled: (_, __, { notebookId }) => {
            queryClient.invalidateQueries({ queryKey: notebooksKeys.notes(notebookId) });
        },
    });
};
