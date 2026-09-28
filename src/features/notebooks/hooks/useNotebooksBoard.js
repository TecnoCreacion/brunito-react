import { useNotebooksQuery } from "../queries/useNotebooksQuery";
import { useReorderNotebooksMutation } from "../mutations/useReorderNotebooksMutation";
import { useCreateNotebookMutation } from "../mutations/useCreateNotebookMutation";
import { useDeleteNotebookMutation } from "../mutations/useDeleteNotebookMutation";

export const useNotebooksBoard = () => {
    // 1. Obtenemos los datos remotos mediante TanStack Query
    const { data: notebooks = [], isLoading, isError } = useNotebooksQuery();

    // 2. Extraemos las mutaciones necesarias para el dominio
    const { mutate: reorderNotebooks } = useReorderNotebooksMutation();
    const { mutateAsync: createNotebook, isPending: isCreating } = useCreateNotebookMutation();
    const { mutate: deleteNotebook } = useDeleteNotebookMutation();

    // 3. Función de negocio para manejar el reordenamiento visual (Drag & Drop)
    const handleReorder = (items) => {
        // Preparamos el payload exacto que espera Laravel: [{ id, position }]
        const payload = items.map((item, index) => ({
            id: item.id,
            position: index,
        }));
        reorderNotebooks(payload);
    };

    return {
        notebooks,
        isLoading,
        isError,
        isCreating,
        createNotebook,
        deleteNotebook,
        handleReorder,
    };
};
