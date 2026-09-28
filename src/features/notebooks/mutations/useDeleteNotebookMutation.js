import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useDeleteNotebookMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => notebooksService.delete(id),

        // 🚀 ACTUALIZACIÓN OPTIMISTA: Se ejecuta inmediatamente al hacer clic en "Eliminar"
        onMutate: async (deletedId) => {
            // 1. Cancelamos peticiones en vuelo para evitar que sobrescriban nuestro cambio optimista
            await queryClient.cancelQueries({ queryKey: notebooksKeys.lists() });

            // 2. Guardamos una "foto" del estado anterior por si la API falla y necesitamos revertir
            const previousNotebooks = queryClient.getQueryData(notebooksKeys.lists());

            // 3. Actualizamos la caché local eliminando la libreta instantáneamente de la vista
            queryClient.setQueryData(notebooksKeys.lists(), (oldData) => {
                if (!oldData) return oldData;
                return oldData.filter((notebook) => notebook.id !== deletedId);
            });

            // 4. Retornamos el contexto con los datos anteriores para usarlo en caso de error
            return { previousNotebooks };
        },

        // Si la API falla (ej. error 500 o sin internet), restauramos la "foto" anterior
        onError: (err, deletedId, context) => {
            if (context?.previousNotebooks) {
                queryClient.setQueryData(notebooksKeys.lists(), context.previousNotebooks);
                // Aquí podrías opcionalmente disparar un Toast global de error
            }
        },

        // Independientemente de si falló o fue exitoso, re-sincronizamos la fuente de verdad con Laravel
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: notebooksKeys.lists() });
        },
    });
};
