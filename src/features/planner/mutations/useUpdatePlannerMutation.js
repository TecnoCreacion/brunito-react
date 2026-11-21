import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const useUpdatePlannerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => plannerService.update(id, data),
        onSuccess: async () => {
            // Invalidamos la caché para refrescar el calendario automáticamente
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: plannerKeys.lists() }), // actualizar listado general
                queryClient.invalidateQueries({ queryKey: plannerKeys.details() }), // actualizar detalles de la seleccion
                queryClient.invalidateQueries({ queryKey: plannerKeys.tags() }), // actualizar listado de tags
            ]);
        },
    });
};
