import { useQuery } from "@tanstack/react-query";
import { plannerKeys } from "./plannerKeys";
import { plannerService } from "../services/plannerService";
import { plannerFormAdapter } from "../adapters/plannerFormAdapter";

export const usePlannerByIdQuery = (id, params) => {
    return useQuery({
        queryKey: plannerKeys.getPlannerById(),
        queryFn: () => plannerService.getPlannerById(id, params),
        select: (data) => plannerFormAdapter(data),
        enabled: !!id,
        staleTime: 1000 * 60 * 60, // Los tags cambian poco, podemos cachearlos por 1 hora
    });
};
