import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useReorderPlannerEventsMutation = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: plannerService.reorderEvents,
        // Actualización optimista inmediata en la caché local para que el arrastre se sienta instantáneo
        onMutate: async ({ orderedIds }) => {
            const queryKey = plannerKeys.list(userId);
            await queryClient.cancelQueries({ queryKey });

            const previousEvents = queryClient.getQueryData(queryKey);

            if (Array.isArray(previousEvents)) {
                const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
                const updatedEvents = previousEvents.map((ev) => (orderMap.has(ev.id) ? { ...ev, sortOrder: orderMap.get(ev.id) } : ev));
                queryClient.setQueryData(queryKey, updatedEvents);
            }

            return { previousEvents };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousEvents) {
                queryClient.setQueryData(plannerKeys.list(userId), context.previousEvents);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: plannerKeys.list(userId) });
        },
    });
};
