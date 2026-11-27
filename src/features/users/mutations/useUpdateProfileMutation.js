import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersKeys } from "../queries/usersKeys";
import { profileService } from "../services/profileService";

export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: profileService.updateProfile,
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(usersKeys.profile(), updatedProfile);
        },
    });
};
