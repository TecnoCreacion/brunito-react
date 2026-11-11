import { useNotebooksQuery } from "../queries/useNotebooksQuery";
import { useReorderNotebooksMutation } from "../mutations/useReorderNotebooksMutation";
import { useCreateNotebookMutation } from "../mutations/useCreateNotebookMutation";
import { useUpdateNotebookMutation } from "../mutations/useUpdateNotebookMutation";
import { useDeleteNotebookMutation } from "../mutations/useDeleteNotebookMutation";
import { useTogglePinMutation } from "../mutations/useTogglePinMutation";

/**
 * 🚀 CAPA 3: Hook Orquestador del Dominio Notebooks
 * Encapsula la reactividad de filtros y las acciones de escritura del módulo.
 *
 * @param {Object} filters - Filtros dinámicos desde la UI (ej. { search: "", isPinned: true })
 */
export const useNotebookMutations = (filters = {}) => {
    // 1. Obtenemos los datos remotos mediante TanStack Query
    const { data: notebooks = [], isLoading, isError, refetch } = useNotebooksQuery(filters);

    // 2. Extraemos las mutaciones necesarias para el dominio
    const { mutate: reorderNotebooks } = useReorderNotebooksMutation();
    const { mutateAsync: createNotebook, isPending: isCreating } = useCreateNotebookMutation();
    const { mutateAsync: updateNotebook, isPending: isUpdating } = useUpdateNotebookMutation();
    const { mutateAsync: deleteNotebook, isPending: isDeleting } = useDeleteNotebookMutation();
    const { mutateAsync: togglePinMutate, isPending: isTogglingPin } = useTogglePinMutation();

    // 3. Función de negocio para manejar el reordenamiento visual (Drag & Drop)
    const handleReorder = (items) => {
        // Preparamos el payload exacto que espera Laravel: [{ id, position }]
        const payload = items.map((item, index) => ({
            id: item.id,
            position: index,
        }));

        reorderNotebooks(payload);
    };

    const handleTogglePin = async (notebook) => {
        return await togglePinMutate({
            id: notebook.id,
            isPinned: !notebook.isPinned,
        });
    };

    return {
        // Estado remoto y reactividad
        notebooks,
        isLoading,
        isError,
        refetch,

        // Banderas de carga para spinners granulares
        isCreating,
        isUpdating,
        isDeleting,
        isTogglingPin,

        // Acciones del dominio
        createNotebook,
        updateNotebook,
        deleteNotebook,
        togglePin: handleTogglePin,
        handleReorder,
    };
};
