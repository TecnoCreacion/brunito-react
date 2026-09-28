import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Avatar } from "@/shared/components/Avatar/Avatar";

export const AppNavbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const displayName = user?.name || "Usuario";

    const isActive = (path) => (location.pathname.startsWith(path) ? "active" : "");

    return (
        <div className="sticky-top">
            {/* CABECERA SUPERIOR: Identidad y Menú de Usuario */}
            <header className="navbar navbar-expand-md navbar-light d-print-none">
                <div className="container-xl">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                        <Link to="/dashboard">
                            <span className="text-primary font-weight-bold fs-2">BrunOS</span>
                        </Link>
                    </h1>

                    <div className="navbar-nav flex-row order-md-last">
                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown">
                                <Avatar name={displayName} size="sm" />

                                <div className="d-none d-xl-block ps-2">
                                    <div>{displayName}</div>

                                    <div className="mt-1 small text-muted">{user?.profile?.name || "Rol"}</div>
                                </div>
                            </a>

                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                <Link to="/profile" className="dropdown-item">
                                    Perfil
                                </Link>

                                <div className="dropdown-divider"></div>

                                <button onClick={logout} className="dropdown-item text-danger">
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* CABECERA INFERIOR: Navegación del ERP */}
            <header className="navbar-expand-md">
                <div className="collapse navbar-collapse" id="navbar-menu">
                    <div className="navbar navbar-light">
                        <div className="container-xl">
                            <ul className="navbar-nav">
                                <li className={`nav-item ${isActive("/dashboard")}`}>
                                    <Link className="nav-link" to="/dashboard">
                                        <span className="nav-link-title">Dashboard</span>
                                    </Link>
                                </li>

                                <li className={`nav-item ${isActive("/notebook")}`}>
                                    <Link className="nav-link" to="/notebooks">
                                        <span className="nav-link-title">Notas</span>
                                    </Link>
                                </li>

                                <li className={`nav-item dropdown ${isActive("/modules")}`}>
                                    <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                                        <span className="nav-link-title">Módulos</span>
                                    </a>

                                    <div className="dropdown-menu">
                                        <Link className="dropdown-item" to="/users">
                                            Usuarios
                                        </Link>

                                        <Link className="dropdown-item" to="/companies">
                                            Empresas
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};
