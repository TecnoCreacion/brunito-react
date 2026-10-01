import { useQuery } from "@tanstack/react-query";
import { plannerKeys } from "./plannerKeys";
import { plannerService } from "../services/plannerService";

export const useFixedTasksQuery = (userId) => {
    return useQuery({
        queryKey: plannerKeys.fixedTasks.all(userId),
        queryFn: () => plannerService.getFixedTasks(userId),
        enabled: !!userId, // No ejecutamos la petición si no hay usuario autenticado
        staleTime: 1000 * 60 * 15, // Consideramos la data fresca por 15 minutos
    });
};
