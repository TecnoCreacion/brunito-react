import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (email) => authService.forgotPassword(email),
    });
};
