import { usePlannerResourcesQuery } from "../queries/usePlannerResourcesQuery";

export const usePlannerResources = (userId) => {
    const {
        data: resources,
        isLoading,
        isError,
        error,
    } = usePlannerResourcesQuery({
        where: {
            user_id: userId,
        },
    });

    return {
        resources,
        isLoading,
        isError,
        error,
    };
};
