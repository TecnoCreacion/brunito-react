import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";

export const PublicLayout = () => {
    return (
        <div className="page">
            <PublicNavbar />

            <div className="page-wrapper">
                <div className="page-body">
                    <div className="container-xl">
                        {/* Aquí se renderizará la página de inicio */}
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};
