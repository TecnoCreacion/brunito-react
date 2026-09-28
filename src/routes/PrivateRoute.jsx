import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth"; // Asumiendo que el hook público está expuesto

export const PrivateRoute = () => {
    const { authenticated } = useAuth();

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
