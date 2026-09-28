import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const PublicRoute = ({ restricted = false }) => {
    const { authenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="page page-center">
                <div className="container container-tight py-4 text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </div>
        );
    }

    // Si la ruta pública es "restringida" (ej. el Login) y el usuario ya está autenticado,
    // lo enviamos directo al sistema para que no vea el formulario de login.
    if (authenticated && restricted) {
        const origin = location.state?.from?.pathname || "/dashboard";

        return <Navigate to={origin} replace />;
    }

    return <Outlet />;
};
