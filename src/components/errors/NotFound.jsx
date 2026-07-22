import { Link, useNavigate } from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="page page-center flex-fill vh-100">
            <div className="container-tight py-4">
                <div className="empty">
                    {/* Un número gigante y sutil de fondo */}
                    <div className="empty-header">404</div>

                    {/* Ilustración de Tabler Icons (Un mapa con un pin perdido) */}
                    <div className="empty-img mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted" width="128" height="128" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
                            <path d="M9 4v13" />
                            <path d="M15 7v13" />
                            <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        </svg>
                    </div>

                    <p className="empty-title">¡Ups! Nos perdimos de ruta...</p>

                    <p className="empty-subtitle text-muted">Lo sentimos, la página que intentas buscar no existe, ha sido movida o no tienes los permisos necesarios para verla.</p>

                    <div className="empty-action">
                        {/* Botón para volver a la página anterior */}
                        <button onClick={() => navigate(-1)} className="btn btn-ghost-secondary me-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 12l14 0" />
                                <path d="M5 12l6 6" />
                                <path d="M5 12l6 -6" />
                            </svg>
                            Volver atrás
                        </button>

                        {/* Botón seguro para ir al Dashboard */}
                        <Link to="/" className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                                <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                            </svg>
                            Ir al Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
