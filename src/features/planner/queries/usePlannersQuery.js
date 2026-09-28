import { useQuery } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerListAdapter } from "../adapters/plannerAdapter";
import { plannerKeys } from "../queries/plannerKeys";

export const usePlannersQuery = (userId) => {
    return useQuery({
        queryKey: plannerKeys.getPlannersByUser(userId),
        queryFn: async () => {
            const data = await plannerService.getPlanners(userId);
            // Transformamos los datos crudos de la tabla de Laravel mediante el adapter
            return plannerListAdapter(data);
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutos de frescura en caché
    });
};
