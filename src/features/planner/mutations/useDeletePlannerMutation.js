import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useDeletePlannerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => plannerService.delete(id),

        onSuccess: async (_, variables) => {
            const { id } = variables;

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: plannerKeys.getPlanners(),
                }),

                queryClient.invalidateQueries({
                    queryKey: plannerKeys.events.all(),
                }),

                queryClient.invalidateQueries({
                    queryKey: plannerKeys.detail(id),
                }),
            ]);
        },
    });
};
