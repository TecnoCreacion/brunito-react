import { useQuery } from "@tanstack/react-query";
import { plannerKeys } from "./plannerKeys";
import { plannerService } from "../services/plannerService";

export const usePlannerByIdQuery = (id, params) => {
    return useQuery({
        queryKey: plannerKeys.getPlannerById(id),
        queryFn: () => plannerService.getPlannerById(id, params),
        enabled: !!id,
        staleTime: 1000 * 60 * 60, // Los tags cambian poco, podemos cachearlos por 1 hora
    });
};
