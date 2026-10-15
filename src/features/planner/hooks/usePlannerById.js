import { usePlannerByIdQuery } from "../queries/usePlannerByIdQuery";

export const usePlannerById = (id, params) => {
    const { data: planner, isLoading, isError, error } = usePlannerByIdQuery(id, params);

    return {
        planner,
        isLoading,
        isError,
        error,
    };
};
