import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";

export const useScheduleFixedTaskMutation = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, weekNumbers }) => plannerService.scheduleFixedTask(taskId, weekNumbers),
        onSuccess: () => {
            // Invalidamos la caché para que el calendario se recargue con las nuevas tareas
            queryClient.invalidateQueries(["planner", "events", userId]);
        },
    });
};
