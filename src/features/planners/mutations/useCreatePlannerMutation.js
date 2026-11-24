import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useCreatePlannerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (plannerData) => plannerService.create(plannerData),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: plannerKeys.getPlanners(),
                }),

                queryClient.invalidateQueries({
                    queryKey: plannerKeys.events.all(),
                }),

                queryClient.invalidateQueries({
                    queryKey: plannerKeys.tags(),
                }),
            ]);
        },
    });
};
