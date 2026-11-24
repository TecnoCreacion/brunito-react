import { useQuery } from "@tanstack/react-query";
import { plannerKeys } from "./plannerKeys";
import { plannerService } from "../services/plannerService";

export const usePlannerTagsQuery = (userId) => {
    return useQuery({
        queryKey: plannerKeys.tags(userId),
        queryFn: () => plannerService.getTags(userId),
        staleTime: 1000 * 60 * 60, // Los tags cambian poco, podemos cachearlos por 1 hora
    });
};
