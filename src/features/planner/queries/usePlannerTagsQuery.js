import { useQuery } from "@tanstack/react-query";
import { plannerKeys } from "./plannerKeys";
import { plannerService } from "../services/plannerService";

export const usePlannerTagsQuery = () => {
    return useQuery({
        queryKey: plannerKeys.tags(),
        queryFn: () => plannerService.getTags(),
        staleTime: 1000 * 60 * 60, // Los tags cambian poco, podemos cachearlos por 1 hora
    });
};
