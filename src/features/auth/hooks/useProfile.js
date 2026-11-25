// src/features/users/hooks/useProfile.js
import { useProfileQuery } from "../queries/useProfileQuery";
import { useUpdateProfileMutation } from "../mutations/useUpdateProfileMutation";
import { useUpdatePasswordMutation } from "../mutations/useUpdatePasswordMutation";

export const useProfile = () => {
    const profileQuery = useProfileQuery();
    const updateProfileMutation = useUpdateProfileMutation();
    const updatePasswordMutation = useUpdatePasswordMutation();

    return {
        profile: profileQuery.data,
        isLoading: profileQuery.isLoading,
        isError: profileQuery.isError,
        updateProfile: updateProfileMutation.mutateAsync,
        isUpdatingProfile: updateProfileMutation.isPending,
        updatePassword: updatePasswordMutation.mutateAsync,
        isUpdatingPassword: updatePasswordMutation.isPending,
    };
};
