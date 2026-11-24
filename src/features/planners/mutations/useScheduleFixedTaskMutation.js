import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useScheduleFixedTaskMutation = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, weekNumbers }) => plannerService.scheduleFixedTask(taskId, weekNumbers),
        onSuccess: async () => {
            // Invalidamos la caché para que el calendario se recargue con las nuevas tareas
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: plannerKeys.getPlanners(),
                }),

                queryClient.invalidateQueries({
                    queryKey: plannerKeys.events.all(),
                }),
            ]);
        },
    });
};
