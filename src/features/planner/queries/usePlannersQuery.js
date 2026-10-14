import { useQuery } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";
import { plannerCalendarAdapter } from "../adapters/plannerCalendarAdapter";
import { plannerKeys } from "../queries/plannerKeys";

export const usePlannersQuery = (userId) => {
    return useQuery({
        queryKey: plannerKeys.getPlannersByUser(userId),

        // 1. queryFn: Únicamente responsable de la comunicación (traer los datos crudos)
        queryFn: async () => {
            return await plannerService.getPlanners(userId);
        },

        // 2. select: Únicamente responsable de adaptar los datos para la UI de React
        select: (data) => {
            // Programación defensiva: Si la API no devuelve un arreglo por algún error, devolvemos uno vacío
            if (!Array.isArray(data)) return [];

            // 🚀 CORRECCIÓN CRÍTICA: Iteramos sobre el arreglo y aplicamos el adapter a cada elemento individual
            return data.map(plannerCalendarAdapter);
        },

        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutos de frescura en caché
    });
};
