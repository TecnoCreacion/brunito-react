import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerTagService } from "../services/plannerTagService";
import { plannerKeys } from "../queries/plannerKeys";

export const useUpdatePlannerTagMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => plannerTagService.update(id, data),
        onSuccess: async () => {
            // Revalidamos etiquetas y eventos del calendario en paralelo
            await Promise.all([queryClient.invalidateQueries({ queryKey: plannerKeys.tags() }), queryClient.invalidateQueries({ queryKey: plannerKeys.all }), queryClient.invalidateQueries({ queryKey: plannerKeys.events.all() })]);
        },
    });
};
