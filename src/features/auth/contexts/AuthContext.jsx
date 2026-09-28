import { createContext, useContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLogoutMutation } from "../mutations/useLogoutMutation";
import { authService } from "../services/authService";
import { authKeys } from "../queries/authKeys";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();

    // Consultamos /me. Si la cookie de sesión es válida, Laravel responde 200 con el usuario.
    // Si no hay sesión o expiró, Laravel responde 401.
    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey: authKeys.me(),
        queryFn: authService.getMe,
        retry: false,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    const login = async (credentials) => {
        await authService.login(credentials);
        // Invalidamos y forzamos la recarga inmediata de /me para hidratar el usuario
        await queryClient.invalidateQueries({ queryKey: authKeys.me() });
    };

    const { mutate: performLogout } = useLogoutMutation({
        onSuccess: () => {
            // 1. Limpiamos TODA la caché de TanStack Query por seguridad
            queryClient.clear();

            // 2. Reseteamos el estado específico de autenticación
            queryClient.setQueryData(authKeys.me(), null);

            // Nota: Si usas LocalStorage para guardar preferencias visuales,
            // este es el lugar para hacer un localStorage.removeItem()
        },
        onError: (error) => {
            // Incluso si el backend falla (ej: timeout), debemos limpiar la sesión local
            // para no dejar al usuario atrapado en un estado inconsistente.
            queryClient.clear();
            queryClient.setQueryData(authKeys.me(), null);
        },
    });

    const logout = useCallback(() => {
        performLogout();
    }, [performLogout]);

    const hasPermission = (permission) => {
        return user?.permissions?.includes(permission) || false;
    };

    const value = {
        user: user || null,
        authenticated: !!user && !isError,
        loading: isLoading,
        login,
        logout,
        hasPermission,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};
