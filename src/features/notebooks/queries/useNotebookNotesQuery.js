import { useQuery } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useNotebookNotesQuery = (notebookNoteId) => {
    return useQuery({
        queryKey: notebooksKeys.notes(notebookNoteId),
        queryFn: () => notebooksService.getNotes(notebookNoteId),
        enabled: !!notebookNoteId, // Solo se ejecuta si tenemos el ID del padre
    });
};
