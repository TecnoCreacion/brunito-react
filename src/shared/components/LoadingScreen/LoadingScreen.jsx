export const LoadingScreen = ({ message = "Cargando BrunOS..." }) => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center">
                {/* Puedes cambiar esto por el logo oficial de la marca desde assets/images/brand */}
                <h1 className="display-4 text-primary mb-4 fw-bold">BrunOS</h1>

                <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Cargando...</span>
                </div>

                <p className="mt-3 text-muted fw-medium">{message}</p>
            </div>
        </div>
    );
};
