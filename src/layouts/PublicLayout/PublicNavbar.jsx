import { Link, useLocation } from "react-router-dom";

export const PublicNavbar = () => {
    const location = useLocation();
    const isActive = (path) => (location.pathname === path ? "active" : "");

    return (
        <header className="navbar navbar-expand-md navbar-light d-print-none">
            <div className="container-xl">
                <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                    <Link to="/">
                        <span className="text-primary font-weight-bold fs-2">BrunOS</span>
                    </Link>
                </h1>

                <div className="navbar-nav flex-row order-md-last">
                    <div className="nav-item">
                        <Link to="/login" className="btn btn-primary">
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>

                <div className="collapse navbar-collapse" id="navbar-menu">
                    <ul className="navbar-nav">
                        <li className={`nav-item ${isActive("/")}`}>
                            <Link className="nav-link" to="/">
                                <span className="nav-link-title">Inicio</span>
                            </Link>
                        </li>

                        <li className={`nav-item ${isActive("/about")}`}>
                            <Link className="nav-link" to="/about">
                                <span className="nav-link-title">Quiénes Somos</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};
