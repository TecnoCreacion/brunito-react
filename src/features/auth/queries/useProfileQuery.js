import { useQuery } from "@tanstack/react-query";
import { usersKeys } from "./usersKeys";
import { profileService } from "../services/profileService";

export const useProfileQuery = () => {
    return useQuery({
        queryKey: usersKeys.profile(),
        queryFn: profileService.getProfile,
    });
};
