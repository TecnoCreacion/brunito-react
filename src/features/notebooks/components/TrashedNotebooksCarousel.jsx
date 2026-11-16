import { useRef } from "react";
import { IconRotateClockwise, IconChevronLeft, IconChevronRight, IconTrashOff, IconX } from "@tabler/icons-react";

export const TrashedNotebooksCarousel = ({ notebooks = [], isLoading, isError, restoringId, onRestore, onClose }) => {
    const trackRef = useRef(null);

    const handleScroll = (direction) => {
        if (!trackRef.current) return;
        const scrollAmount = 320;
        trackRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const formatDeletedDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="card border-danger-subtle bg-light-subtle shadow-sm mb-4">
            <div className="card-header d-flex justify-content-between align-items-center py-2">
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-danger-lt text-danger">Papelera</span>
                    <span className="text-muted small">Libretas eliminadas ({notebooks.length})</span>
                </div>

                <div className="d-flex align-items-center gap-1">
                    {notebooks.length > 0 && (
                        <>
                            <button type="button" className="btn btn-sm btn-icon btn-outline-secondary" onClick={() => handleScroll("left")} title="Anterior">
                                <IconChevronLeft size={16} />
                            </button>
                            <button type="button" className="btn btn-sm btn-icon btn-outline-secondary" onClick={() => handleScroll("right")} title="Siguiente">
                                <IconChevronRight size={16} />
                            </button>
                        </>
                    )}
                    <button type="button" className="btn btn-sm btn-icon btn-ghost-secondary ms-2" onClick={onClose} title="Cerrar papelera">
                        <IconX size={16} />
                    </button>
                </div>
            </div>

            <div className="card-body py-3">
                {isError && (
                    <div className="alert alert-danger mb-0 py-2 small" role="alert">
                        No se pudieron cargar las libretas eliminadas.
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-4 text-muted small">
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Cargando papelera...
                    </div>
                ) : notebooks.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                        <IconTrashOff size={28} className="mb-1 opacity-50" />
                        <p className="small mb-0">La papelera está vacía.</p>
                    </div>
                ) : (
                    <div ref={trackRef} className="d-flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory", scrollbarWidth: "thin" }}>
                        {notebooks.map((notebook) => {
                            const isThisRestoring = restoringId === notebook.id;

                            return (
                                <div
                                    key={notebook.id}
                                    className="card border shadow-none flex-shrink-0 d-flex flex-column justify-content-between"
                                    style={{
                                        width: "280px",
                                        scrollSnapAlign: "start",
                                        borderStyle: "dashed",
                                    }}
                                >
                                    <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                                            <h4 className="card-title h5 mb-0 text-truncate" title={notebook.title}>
                                                {notebook.title || "Sin título"}
                                            </h4>
                                            <span className="badge bg-secondary-lt flex-shrink-0">{notebook.notes?.length || 0} notas</span>
                                        </div>

                                        <p className="text-muted small text-truncate mb-2">{notebook.description || "Sin descripción"}</p>

                                        {notebook.deletedAt && (
                                            <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                                                Eliminada el {formatDeletedDate(notebook.deletedAt)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer bg-transparent border-top-0 pt-0 px-3 pb-3">
                                        <button type="button" className="btn btn-sm btn-outline-success w-100 d-flex align-items-center justify-content-center gap-1" onClick={() => onRestore(notebook.id)} disabled={isThisRestoring}>
                                            {isThisRestoring ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span>Restaurando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <IconRotateClockwise size={16} />
                                                    <span>Restaurar</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
