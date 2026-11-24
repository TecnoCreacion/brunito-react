import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useScheduleTasksForWeekMutation = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        // El servicio maneja la comunicación HTTP, el componente no sabe cómo se hace
        mutationFn: ({ weekNumber, taskIds, isoYear }) => plannerService.scheduleTasksForWeek({ weekNumber, taskIds, isoYear }),

        onSuccess: async () => {
            // Invalidamos la caché de los eventos para que el calendario se recargue automáticamente
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
