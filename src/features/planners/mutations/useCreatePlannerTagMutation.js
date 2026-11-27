import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerTagService } from "../services/plannerTagService";
import { plannerKeys } from "../queries/plannerKeys";

export const useCreatePlannerTagMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => plannerTagService.create(formData),
        onSuccess: async () => {
            // Revalidación en segundo plano contra Laravel (fuente única de verdad)
            await Promise.all([queryClient.invalidateQueries({ queryKey: plannerKeys.tags() })]);
        },
    });
};
