import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

export const MainLayout = () => {
    // 1. Extraemos al usuario y la función de cierre de sesión de nuestro contexto
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // 2. Función manejadora del botón
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    return (
        <div className="page">
            {/* 1. SIDEBAR (Menú Lateral Oscuro) */}
            <aside className="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-menu">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <h1 className="navbar-brand navbar-brand-autodark">
                        <Link to="/">FactorSystem</Link>
                    </h1>

                    <div className="collapse navbar-collapse" id="sidebar-menu">
                        <ul className="navbar-nav pt-lg-3">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                                            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                                            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                                        </svg>
                                    </span>
                                    <span className="nav-link-title">Dashboard</span>
                                </Link>
                            </li>
                            {/* Aquí agregaremos la ruta de usuarios pronto */}
                        </ul>
                    </div>
                </div>
            </aside>

            {/* 2. ÁREA DE CONTENIDO (Derecha) */}
            <div className="page-wrapper">
                <header className="navbar navbar-expand-md d-none d-lg-flex d-print-none">
                    <div className="container-xl">
                        <div className="navbar-nav flex-row order-md-last">
                            <div className="nav-item dropdown">
                                <a href="#" className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown">
                                    {/* Avatar dinámico usando las iniciales o el nombre del usuario */}
                                    <span className="avatar avatar-sm" style={{ backgroundImage: `url(https://ui-avatars.com/api/?name=${user?.name || "U"})` }}></span>
                                    <div className="d-none d-xl-block ps-2">
                                        {/* Nombre real extraído de Laravel */}
                                        <div>{user?.name || "Usuario"}</div>
                                        {/* Username real */}
                                        <div className="mt-1 small text-muted">@{user?.username || "admin"}</div>
                                    </div>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <Link to="/perfil" className="dropdown-item">
                                        {/* Icono de usuario */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2 text-muted" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                        </svg>
                                        Mi Perfil
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    {/* Botón semántico para cerrar sesión */}
                                    <button onClick={handleLogout} className="dropdown-item text-danger w-100 text-start">
                                        {/* Icono de salir */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2 text-danger" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                            <path d="M9 12h12l-3 -3" />
                                            <path d="M18 15l3 -3" />
                                        </svg>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 3. EL CORAZÓN DEL LAYOUT */}
                <div className="page-body">
                    <div className="container-xl">
                        <Outlet />
                    </div>
                </div>

                {/* Footer */}
                <footer className="footer footer-transparent d-print-none">
                    <div className="container-xl">
                        <div className="text-center align-items-center flex-row-reverse">
                            <div className="mt-3 mt-lg-0">Copyright &copy; {new Date().getFullYear()} FactorSystem. Todos los derechos reservados.</div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
