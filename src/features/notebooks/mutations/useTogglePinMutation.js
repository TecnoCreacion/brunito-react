import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notebooksKeys } from "../keys/notebooksKeys";
import { notebooksService } from "../services/notebooksService";
import { alerts } from "@/shared/utils/alerts"; // Asumiendo que usas este helper corporativo

export const useTogglePinMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // 🚀 Capa 5: Llamamos al servicio (axios)
        mutationFn: ({ id, isPinned }) => notebooksService.togglePin(id, isPinned),

        // 🚀 Actualización Optimista: Actualizamos la UI antes de que el servidor responda
        onMutate: async ({ id, isPinned }) => {
            // Cancelar peticiones en vuelo para evitar conflictos de datos
            await queryClient.cancelQueries({ queryKey: notebooksKeys.lists() });

            // Guardar una copia del estado anterior para el rollback
            const previousNotebooks = queryClient.getQueryData(notebooksKeys.lists());

            // Modificar la caché directamente para una respuesta visual instantánea
            queryClient.setQueryData(notebooksKeys.lists(), (old) => {
                if (!old) return [];
                return old.map((notebook) => {
                    if (notebook.id === id) {
                        return {
                            ...notebook,
                            is_pinned: isPinned,
                            // Regla visual inmediata: si se fija, forzamos a md temporalmente en frontend
                            size: isPinned ? "md" : notebook.size,
                        };
                    }
                    return notebook;
                });
            });

            return { previousNotebooks };
        },

        // 🚀 Manejo de Errores (Ej: Laravel devuelve 422 porque ya hay 2 libretas fijadas)
        onError: (error, variables, context) => {
            // Revertimos la UI a como estaba antes del clic
            if (context?.previousNotebooks) {
                queryClient.setQueryData(notebooksKeys.lists(), context.previousNotebooks);
            }

            // Extraemos el mensaje de validación exacto desde Laravel
            const errorMessage = error.response?.data?.errors?.is_pinned?.[0] || error.response?.data?.message || "Ocurrió un error al actualizar la libreta.";

            alerts.error("No se pudo fijar", errorMessage);
        },

        // 🚀 Sincronización Final: Independiente de si fue éxito o error, sincronizamos con Laravel
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: notebooksKeys.lists() });
        },
    });
};
