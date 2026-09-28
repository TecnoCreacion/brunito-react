import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";

export const useLoginMutation = (options) => {
    return useMutation({
        mutationFn: authService.login,
        ...options,
    });
};
