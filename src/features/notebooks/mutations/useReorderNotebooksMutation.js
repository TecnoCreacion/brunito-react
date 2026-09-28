import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useReorderNotebooksMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newOrderPayload) => notebooksService.reorderNotebooks(newOrderPayload),

        // 🚀 ACTUALIZACIÓN OPTIMISTA (La magia del Drag & Drop)
        onMutate: async (newOrderPayload) => {
            // 1. Cancelamos peticiones en vuelo para que no sobrescriban nuestro cambio optimista
            await queryClient.cancelQueries({ queryKey: notebooksKeys.lists() });

            // 2. Guardamos una foto del estado anterior por si la API falla
            const previousNotebooks = queryClient.getQueryData(notebooksKeys.lists());

            // 3. Actualizamos la caché local inmediatamente con el nuevo orden visual
            queryClient.setQueryData(notebooksKeys.lists(), (oldData) => {
                if (!oldData) return oldData;

                // Clonamos el array y reasignamos las posiciones basándonos en el payload que armó React
                const updatedList = [...oldData];
                newOrderPayload.forEach((orderItem) => {
                    const index = updatedList.findIndex((n) => n.id === orderItem.id);
                    if (index !== -1) updatedList[index].position = orderItem.position;
                });

                // Devolvemos la lista ordenada para que React la pinte al instante
                return updatedList.sort((a, b) => a.position - b.position);
            });

            // Retornamos el contexto con los datos anteriores para el rollback
            return { previousNotebooks };
        },

        // Si la API arroja un error (ej: 500, sin conexión), deshacemos el movimiento visual
        onError: (err, newOrderPayload, context) => {
            if (context?.previousNotebooks) {
                queryClient.setQueryData(notebooksKeys.lists(), context.previousNotebooks);
            }
        },

        // Independientemente de si falló o fue exitoso, sincronizamos la fuente de verdad con Laravel
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: notebooksKeys.lists() });
        },
    });
};
