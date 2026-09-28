import { AppProviders } from "./providers";
import { AppRouter } from "@/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingScreen } from "@/shared/components/LoadingScreen/LoadingScreen";

// 1. Creamos un componente interno que ya está envuelto por los Providers
const AppBootstrap = () => {
    // Como AppBootstrap está dentro de AppProviders, useAuth funciona perfectamente
    const { loading } = useAuth();

    // 2. Si Laravel está validando el token inicial, detenemos el renderizado
    if (loading) {
        return <LoadingScreen message="Validando credenciales y permisos..." />;
    }

    // 3. Una vez validada la sesión (éxito o fallo), montamos el sistema de rutas
    return <AppRouter />;
};

export const App = () => {
    return (
        <AppProviders>
            {/* AppBootstrap se encarga de conectar el estado global con el Router */}
            <AppBootstrap />
        </AppProviders>
    );
};
