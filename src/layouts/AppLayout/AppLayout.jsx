import { Outlet } from "react-router-dom";
import { AppNavbar } from "./AppNavbar";

export const AppLayout = () => {
    return (
        <div className="page">
            <AppNavbar />

            {/* <Sidebar /> Aquí irá el menú lateral dinámico en el futuro */}
            <div className="page-wrapper">
                <div className="page-body">
                    <div className="container-xl">
                        {/* Aquí se renderizarán los módulos del ERP (Usuarios, Empresas, etc.) */}
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};
