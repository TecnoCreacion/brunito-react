import { usePlannersQuery } from "../queries/usePlannersQuery";

export const usePlanner = (userId) => {
    const { data: events = [], isLoading, isError, error } = usePlannersQuery(userId);

    return {
        events,
        isLoading,
        isError,
        error,
    };
};
