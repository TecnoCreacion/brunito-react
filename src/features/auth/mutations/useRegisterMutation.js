import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: (userData) => authService.register(userData),
        // La responsabilidad de actualizar el contexto global o redirigir
        // se manejará en el Hook de la UI para mantener esta capa pura.
    });
};
