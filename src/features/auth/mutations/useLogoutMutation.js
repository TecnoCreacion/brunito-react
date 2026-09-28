import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";

export const useLogoutMutation = (options) => {
    return useMutation({
        mutationFn: authService.logout,
        ...options,
    });
};
