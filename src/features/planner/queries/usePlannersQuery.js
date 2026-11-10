import { useQuery } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerKeys } from "../queries/plannerKeys";

export const usePlannersQuery = (userId) => {
    return useQuery({
        queryKey: plannerKeys.getPlannersByUser(userId),

        // 1. queryFn: Únicamente responsable de la comunicación (traer los datos crudos)
        queryFn: async () => {
            return await plannerService.getPlanners(userId);
        },

        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutos de frescura en caché
    });
};
