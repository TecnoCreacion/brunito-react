import { useQuery } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

export const useNotebookQuery = (notebookId) => {
    return useQuery({
        // 1. La llave de caché AHORA incluye el ID. Esto aísla esta consulta del listado general.
        queryKey: notebooksKeys.detail(notebookId),

        // 2. Ejecutamos el servicio correcto pasando el ID
        queryFn: () => notebooksService.getById(notebookId),

        // 3. PROTECCIÓN: Solo ejecuta la petición si notebookId tiene un valor (no es null ni undefined)
        enabled: !!notebookId,

        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useNotebooksQuery = () => {
    return useQuery({
        queryKey: notebooksKeys.lists(),

        queryFn: () => notebooksService.getAll(),

        staleTime: 1000 * 60 * 5,
    });
};
