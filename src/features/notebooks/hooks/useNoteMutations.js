import { useCreateNoteMutation } from "../mutations/useCreateNoteMutation";
import { useUpdateNoteMutation } from "../mutations/useUpdateNoteMutation";
import { useDeleteNoteMutation } from "../mutations/useDeleteNoteMutation";

export const useNoteMutations = () => {
    // 1. Extraemos las mutaciones necesarias para el dominio de Notas
    const { mutateAsync: createNote, isPending: isCreatingNote } = useCreateNoteMutation();
    const { mutateAsync: updateNote, isPending: isUpdatingNote } = useUpdateNoteMutation();
    const { mutateAsync: deleteNote, isPending: isDeletingNote } = useDeleteNoteMutation();

    return {
        createNote,
        updateNote,
        deleteNote,
        isCreatingNote,
        isUpdatingNote,
        isDeletingNote,
    };
};
