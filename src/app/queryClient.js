import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // STALE TIME: El tiempo que la data se considera "fresca".
            // 5 minutos es un estándar excelente para un ERP. Evita que React haga
            // peticiones a Laravel cada vez que el usuario cambia de pestaña.
            staleTime: 1000 * 60 * 5,

            // CACHE TIME (gcTime en v5): Cuánto tiempo se guarda en memoria la data inactiva.
            gcTime: 1000 * 60 * 15, // 15 minutos

            // REINTENTOS: Protegemos a Laravel de bucles infinitos.
            retry: (failureCount, error) => {
                const status = error?.response?.status;

                // NUNCA reintentar si es un error de Autenticación (401),
                // Permisos (403), No encontrado (404) o Validación de Formulario (422)
                if (status === 401 || status === 403 || status === 404 || status === 422) {
                    return false;
                }

                // Para errores de red o errores de servidor (500), reintentamos máximo 1 vez
                return failureCount < 1;
            },

            // UX: En un ERP, si el usuario va a Excel y vuelve al sistema,
            // no queremos disparar 20 peticiones de golpe.
            // Como usamos un staleTime de 5 min, podríamos dejarlo activo,
            // pero para tener control absoluto, lo desactivamos por defecto.
            refetchOnWindowFocus: false,

            // Si el usuario pierde internet y vuelve, no disparamos consultas automáticas.
            refetchOnReconnect: false,
        },
        mutations: {
            // REGLA DE ORO DE BrunOS: Las mutaciones (POST, PUT, DELETE) NUNCA se
            // reintentan automáticamente. Podríamos cobrar una factura dos veces.
            retry: false,
        },
    },
});
