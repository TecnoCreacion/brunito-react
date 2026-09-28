import { useFixedTasksQuery } from "../queries/useFixedTasksQuery";
import { usePlannerTagsQuery } from "../queries/usePlannerTagsQuery";

export const usePlannerSidebar = (userId) => {
    // 1. Obtenemos las tareas fijas
    const { data: fixedTasks = [], isLoading: isLoadingTasks, isError: isErrorTasks } = useFixedTasksQuery(userId);

    // 2. Obtenemos las etiquetas
    const { data: tags = [], isLoading: isLoadingTags, isError: isErrorTags } = usePlannerTagsQuery();

    // 3. Orquestamos el estado derivado para la UI
    // Si cualquiera de las dos consultas está cargando, el sidebar está cargando
    const isLoading = isLoadingTasks || isLoadingTags;

    // Si alguna falla, notificamos un error global para el sidebar
    const isError = isErrorTasks || isErrorTags;

    return {
        fixedTasks,
        tags,
        isLoading,
        isError,
    };
};
