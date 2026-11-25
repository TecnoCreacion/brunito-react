import { useMutation } from "@tanstack/react-query";
import { profileService } from "../services/profileService";

export const useUpdatePasswordMutation = () => {
    return useMutation({
        mutationFn: profileService.updatePassword,
    });
};
