import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // En un ERP/CRM no queremos bombardear el servidor si el usuario cambia de pestaña
            refetchOnWindowFocus: false,

            // Si una petición falla, solo reintenta 1 vez más automáticamente
            retry: 1,

            // La data se considera "fresca" por 5 minutos.
            // Durante este tiempo, si el usuario vuelve a la misma vista, no se hace petición a Laravel.
            staleTime: 1000 * 60 * 5,
        },
    },
});
