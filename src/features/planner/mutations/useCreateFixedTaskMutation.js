import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerKeys } from "../queries/plannerKeys";
import { plannerService } from "../services/plannerService";

export const useCreateFixedTaskMutation = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskData) => plannerService.createFixedTask(taskData),
        onSuccess: async () => {
            // 🚀 Invalidamos la caché para que el SidebarWidget se actualice automáticamente sin recargar la página
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
                    queryKey: plannerKeys.tags(),
                }),
            ]);
        },
        onError: (error) => {
            // Aquí puedes conectar tu sistema de notificaciones global (Toasts)
            console.error("Error al crear la tarea fija:", error);
        },
    });
};
