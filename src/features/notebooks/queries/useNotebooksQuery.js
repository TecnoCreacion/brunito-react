import { useQuery } from "@tanstack/react-query";
import { notebooksService } from "../services/notebooksService";
import { notebooksKeys } from "../keys/notebooksKeys";

/**
 * 🚀 CAPA 4: Query remota de Libretas
 * Administra el caché reactivo a filtros y el tiempo de obsolescencia.
 */
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

export const useNotebooksQuery = (filters = {}) => {
    return useQuery({
        // 🚀 1: Usamos 'list(filters)' para que la clave reaccione a los cambios
        queryKey: notebooksKeys.list(filters),

        // 🚀 2: Garantizamos el pase de los filtros al servicio
        queryFn: ({ queryKey }) => {
            const [, , queryFilters] = queryKey;

            return notebooksService.getAll(queryFilters);
        },

        // 🚀 3: Expresión limpia de staleTime (5 minutos de caché fresco)
        staleTime: 1000 * 60 * 5,
    });
};
