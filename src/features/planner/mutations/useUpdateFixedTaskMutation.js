import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useUpdateFixedTaskMutation = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        // 🚀 Capa de Servicio: La mutación no sabe de Axios ni de URLs, solo delega al servicio.
        mutationFn: ({ id, data }) => plannerService.updateFixedTask(id, data),

        onSuccess: () => {
            // 🚀 Invalidación inteligente: "Invalidar únicamente lo necesario"
            // Forzamos la recarga del SidebarWidget
            queryClient.invalidateQueries({
                queryKey: plannerKeys.fixedTasks.list(userId),
            });

            // Si la tarea fija tiene impacto visual en el calendario, también invalidamos los eventos
            queryClient.invalidateQueries({
                queryKey: plannerKeys.events.list(userId),
            });
        },

        onError: (error) => {
            // Nota arquitectónica: Los errores 401 o 500 se manejan en el interceptor global de Axios.
            // Aquí solo manejamos errores de negocio (ej. validaciones 422) si la vista necesita reaccionar a ellos.
            console.error("Fallo al actualizar la tarea fija en el módulo Planner:", error);
        },
    });
};
