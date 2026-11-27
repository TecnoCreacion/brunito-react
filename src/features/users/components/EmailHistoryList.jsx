export const EmailHistoryList = ({ histories = [] }) => {
    const formatDate = (isoDate) => {
        if (!isoDate) return "—";
        return new Date(isoDate).toLocaleDateString("es-CL", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Historial de Correos Asociados</h3>
            </div>

            {histories.length === 0 ? (
                <div className="card-body text-center text-muted py-4">No hay registros de historial de correos disponibles.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-vcenter card-table">
                        <thead>
                            <tr>
                                <th>Correo electrónico</th>
                                <th>Estado</th>
                                <th>Registrado</th>
                                <th>Desactivado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {histories.map((item) => (
                                <tr key={item.id}>
                                    <td className="fw-medium">{item.email}</td>
                                    <td>{item.isActive ? <span className="badge bg-success-lt">Activo</span> : <span className="badge bg-secondary-lt">Histórico</span>}</td>
                                    <td className="text-muted small">{formatDate(item.createdAt)}</td>
                                    <td className="text-muted small">{item.isActive ? "En uso actual" : formatDate(item.deactivatedAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
