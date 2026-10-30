import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";

export const useScheduleTasksForWeekMutation = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        // El servicio maneja la comunicación HTTP, el componente no sabe cómo se hace
        mutationFn: ({ weekNumber, taskIds, isoYear }) => plannerService.scheduleTasksForWeek({ weekNumber, taskIds, isoYear }),

        onSuccess: () => {
            // Invalidamos la caché de los eventos para que el calendario se recargue automáticamente
            queryClient.invalidateQueries(["planner", "events", userId]);
        },
    });
};
