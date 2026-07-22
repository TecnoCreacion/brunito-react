import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export const useUsersSearch = (payload, isEnabled) => {
    return useQuery({
        // La llave cambia cuando cambia la búsqueda
        queryKey: ["users", payload],
        queryFn: () => userService.getUsers(payload),
        // MAGIA: Solo dispara la petición si el usuario escribió al menos 3 letras
        enabled: isEnabled,
        // Guardamos los resultados en caché por 1 minuto
        staleTime: 60000,
    });
};

export const useUserMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: userService.create,
        onSuccess: () => {
            // Invalida la caché para refrescar la tabla automáticamente
            queryClient.invalidateQueries(["users"]);
        },
    });

    const updateMutation = useMutation({
        mutationFn: userService.update,
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });

    return { createMutation, updateMutation };
};
