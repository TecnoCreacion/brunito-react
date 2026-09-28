import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
    return (
        // Tabler provee clases específicas para centrar el login
        <div className="page page-center">
            <Outlet />
        </div>
    );
};
