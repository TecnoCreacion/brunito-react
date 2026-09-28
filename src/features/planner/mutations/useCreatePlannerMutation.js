import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useCreatePlannerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (plannerData) => plannerService.create(plannerData),
        onSuccess: () => {
            // Invalidamos la caché para que FullCalendar recargue los datos actualizados de inmediato
            return queryClient.invalidateQueries({ queryKey: plannerKeys.all });
        },
    });
};
