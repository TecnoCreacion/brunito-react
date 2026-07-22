import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    // Mientras verificamos con Laravel, mostramos un spinner
    if (isLoading) {
        return (
            <div className="page page-center">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    // Si no hay usuario, lo mandamos al login de un portazo
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si está logueado, dejamos pasar (renderizamos el MainLayout)
    return <Outlet />;
};
