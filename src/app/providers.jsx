import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient"; // Ahora vive correctamente en app/
import { AuthProvider } from "../features/auth"; // Importamos desde la API pública de la Feature

export const AppProviders = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    );
};
