import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useUpdatePlannerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => plannerService.update(id, data),
        onSuccess: () => {
            // Invalidamos la caché para refrescar el calendario automáticamente
            return queryClient.invalidateQueries({ queryKey: plannerKeys.all });
        },
    });
};
