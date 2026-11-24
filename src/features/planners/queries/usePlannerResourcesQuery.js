import { useQuery } from "@tanstack/react-query";
import { plannerKeys } from "./plannerKeys";
import { plannerService } from "../services/plannerService";

export const usePlannerResourcesQuery = (params) => {
    return useQuery({
        queryKey: plannerKeys.resources(),
        queryFn: () => plannerService.getResources(params),
        staleTime: 1000 * 60 * 60, // Los tags cambian poco, podemos cachearlos por 1 hora
    });
};
