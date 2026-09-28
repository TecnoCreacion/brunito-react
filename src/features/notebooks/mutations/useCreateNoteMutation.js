import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useCreateNoteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // Asegúrate de que tu service reciba el notebookId para armar la URL si es necesario
        mutationFn: ({ notebookId, payload }) => notebooksService.createNote(notebookId, payload),

        // El parámetro `variables` contiene exactamente lo que enviaste desde el componente
        onSuccess: (data, variables) => {
            // 1. Refrescamos las notas dentro del modal actual
            queryClient.invalidateQueries({ queryKey: notebooksKeys.detail(variables.notebookId) });

            // 2. Refrescamos el tablero principal (Dashboard) en segundo plano
            queryClient.invalidateQueries({ queryKey: notebooksKeys.lists() });
        },
    });
};
