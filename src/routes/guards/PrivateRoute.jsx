import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const PrivateRoute = () => {
    const { authenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="page page-center">
                <div className="container container-tight py-4 text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3 text-muted">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, lo enviamos al login guardando la ruta a la que intentaba ir
    if (!authenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
