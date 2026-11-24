import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useUpdatePlannerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => plannerService.update(id, data),

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

                queryClient.invalidateQueries({
                    queryKey: plannerKeys.tags(),
                }),
            ]);
        },
    });
};
