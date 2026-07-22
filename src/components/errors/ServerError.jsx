import { useNavigate, useRouteError } from "react-router-dom";

export const ServerError = () => {
    // React Router nos permite capturar el error exacto si lo necesitamos
    const error = useRouteError();
    const navigate = useNavigate();

    // Función para forzar la recarga completa de la aplicación
    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="page page-center flex-fill vh-100 bg-light">
            <div className="container-tight py-4">
                <div className="empty">
                    <div className="empty-header text-danger">500</div>

                    {/* Ilustración de Tabler (Servidor en llamas o advertencia) */}
                    <div className="empty-img mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon text-danger" width="128" height="128" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                            <path d="M3 12m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                            <path d="M7 8l0 .01" />
                            <path d="M7 16l0 .01" />
                            <path d="M12 4l0 16" />
                            <path d="M16 4l0 16" />
                        </svg>
                    </div>

                    <p className="empty-title">¡Houston, tenemos un problema!</p>

                    <p className="empty-subtitle text-muted">Hemos experimentado un error interno en el servidor. Nuestro equipo técnico ya ha sido notificado. Por favor, intenta recargar la página en unos momentos.</p>

                    {/* Opcional: Solo en desarrollo mostramos el mensaje técnico */}
                    {import.meta.env.DEV && error && (
                        <div className="alert alert-danger mt-3 text-start overflow-auto" style={{ maxHeight: "150px" }}>
                            <code>{error.statusText || error.message}</code>
                        </div>
                    )}

                    <div className="empty-action mt-4">
                        <button onClick={handleReload} className="btn btn-primary me-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                            </svg>
                            Recargar el Sistema
                        </button>

                        <button onClick={() => navigate(-1)} className="btn btn-ghost-secondary">
                            Volver atrás
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
