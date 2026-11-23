import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useUpdateFixedTaskMutation = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        // 🚀 Capa de Servicio: La mutación no sabe de Axios ni de URLs, solo delega al servicio.
        mutationFn: ({ id, data }) => plannerService.updateFixedTask(id, data),

        onSuccess: async () => {
            // 🚀 Invalidación inteligente: "Invalidar únicamente lo necesario"
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: plannerKeys.getPlanners(),
                }),

                queryClient.invalidateQueries({
                    queryKey: plannerKeys.fixedTasks.all(userId),
                }),

                queryClient.invalidateQueries({
                    queryKey: plannerKeys.events.all(),
                }),

                queryClient.invalidateQueries({
                    queryKey: plannerKeys.detail(userId),
                }),

                queryClient.invalidateQueries({
                    queryKey: plannerKeys.tags(),
                }),
            ]);
        },

        onError: (error) => {
            // Nota arquitectónica: Los errores 401 o 500 se manejan en el interceptor global de Axios.
            // Aquí solo manejamos errores de negocio (ej. validaciones 422) si la vista necesita reaccionar a ellos.
            console.error("Fallo al actualizar la tarea fija en el módulo Planner:", error);
        },
    });
};
