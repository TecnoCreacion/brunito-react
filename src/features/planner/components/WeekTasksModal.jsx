import { Modal } from "@/shared/components/Modal/Modal";
import { IconBriefcase, IconCheck, IconPlus, IconTrash, IconCalendarPlus, IconListCheck } from "@tabler/icons-react";
import { useWeekTasksForm } from "../hooks/useWeekTasksForm";

export const WeekTasksModal = ({ isOpen, onClose, onSave, weekNumber, availableManualTasks = [], isSaving = false }) => {
    const { selectedTaskIds, handleAddTask, handleRemoveTask, handleSave, isReadyToSave } = useWeekTasksForm(isOpen, [], onSave);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Planificar Semana ${weekNumber || ""}`} size="lg">
            <form onSubmit={handleSave} className="d-flex flex-column flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
                {/* CUERPO DEL MODAL */}
                <div className="modal-body p-0 d-flex flex-column flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
                    {/* Indicador de carga: no cubre el header ni el footer */}
                    <div className="position-relative d-flex flex-column flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
                        {isSaving && (
                            <div
                                className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                                style={{
                                    zIndex: 10,
                                    backgroundColor: "rgba(255,255,255,0.85)",
                                    backdropFilter: "blur(2px)",
                                }}
                                role="status"
                                aria-live="polite"
                            >
                                <span
                                    className="spinner-border text-primary mb-3"
                                    style={{
                                        width: "2.5rem",
                                        height: "2.5rem",
                                    }}
                                />
                                <h4 className="text-primary fw-bold mb-1">Generando eventos...</h4>
                                <p className="text-muted small mb-0">Sincronizando con el calendario de BrunOS</p>
                            </div>
                        )}

                        <div
                            className="row g-0 flex-grow-1 overflow-hidden"
                            style={{
                                minHeight: "50vh",
                                height: "100%",
                            }}
                        >
                            {/* COLUMNA IZQUIERDA */}
                            <div className="col-md-6 border-end bg-light d-flex flex-column overflow-hidden">
                                <div className="p-3 border-bottom bg-white d-flex align-items-center flex-shrink-0">
                                    <span className="bg-primary-lt text-primary p-2 rounded me-3">
                                        <IconCalendarPlus size={20} />
                                    </span>

                                    <div className="min-w-0">
                                        <h4 className="h4 mb-0 text-dark">Turnos Disponibles</h4>
                                        <div className="text-muted small">Plantillas manuales configuradas</div>
                                    </div>
                                </div>

                                {/* Scroll independiente */}
                                <div className="p-3 flex-grow-1 overflow-y-auto" style={{ minHeight: 0 }}>
                                    {availableManualTasks.length === 0 ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-center border border-dashed rounded bg-white">
                                            <IconBriefcase size={32} className="text-muted opacity-50 mb-2" />
                                            <span className="text-muted small fw-medium">No hay turnos manuales disponibles</span>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-2">
                                            {availableManualTasks.map((task) => (
                                                <div key={task.id} className="card border shadow-none">
                                                    <div className="card-body p-3 d-flex justify-content-between align-items-center">
                                                        <div className="min-w-0">
                                                            <h6 className="mb-1 text-dark fw-bold">{task.title}</h6>

                                                            {task.tags?.length > 0 && (
                                                                <div className="d-flex flex-wrap gap-1">
                                                                    {task.tags.map((tag) => (
                                                                        <span key={tag} className="badge bg-secondary-lt text-secondary border border-secondary-subtle" style={{ fontSize: "0.65rem" }}>
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center justify-content-center flex-shrink-0 ms-2 rounded-2"
                                                            style={{
                                                                width: "36px",
                                                                height: "36px",
                                                                padding: 0,
                                                                backgroundColor: "#fff",
                                                                borderColor: "#d8dee8",
                                                                transition: "background-color 150ms ease, border-color 150ms ease",
                                                            }}
                                                            onClick={() => handleAddTask(task.id)}
                                                            disabled={isSaving}
                                                            title="Agregar a la planificación"
                                                            aria-label={`Agregar ${task.title}`}
                                                        >
                                                            <IconPlus size={19} stroke={1.8} className="text-primary" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* COLUMNA DERECHA */}
                            <div className="col-md-6 bg-white d-flex flex-column overflow-hidden">
                                <div className="p-3 border-bottom d-flex align-items-center flex-shrink-0">
                                    <span className="bg-success-lt text-success p-2 rounded me-3">
                                        <IconListCheck size={20} />
                                    </span>

                                    <div className="min-w-0">
                                        <h4 className="h4 mb-0 text-dark">Planificación</h4>

                                        <div className="text-muted small">Semana {weekNumber || "--"}</div>
                                    </div>

                                    <span className="badge ms-auto rounded-pill px-3 flex-shrink-0">{selectedTaskIds.length} turnos</span>
                                </div>

                                {/* Scroll independiente */}
                                <div className="p-3 flex-grow-1 overflow-y-auto" style={{ minHeight: 0 }}>
                                    {selectedTaskIds.length === 0 ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-center">
                                            <div className="avatar avatar-lg bg-light text-muted mb-3">
                                                <IconBriefcase size={28} />
                                            </div>

                                            <h5 className="text-dark mb-1">Sin turnos asignados</h5>

                                            <p className="text-muted small mb-0">
                                                Utiliza el botón <IconPlus size={14} className="d-inline" /> de la izquierda para agregar turnos.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-2">
                                            {selectedTaskIds.map((taskId, index) => {
                                                const taskDetails = availableManualTasks.find((task) => task.id === taskId);

                                                return (
                                                    <div key={`${taskId}-${index}`} className="d-flex align-items-center p-2 border rounded bg-primary-lt border-primary-subtle">
                                                        <div className="text-primary opacity-50 small fw-bold ms-1 me-3">{String(index + 1).padStart(2, "0")}</div>

                                                        <div className="flex-grow-1 text-primary-emphasis fw-medium text-break">{taskDetails?.title || "Turno desconocido"}</div>

                                                        <button type="button" className="btn btn-sm btn-icon text-danger border-0 flex-shrink-0 ms-2" onClick={() => handleRemoveTask(index)} disabled={isSaving} title="Quitar de la lista" aria-label="Quitar turno">
                                                            <IconTrash size={18} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER FIJO */}
                <div className="modal-footer border-top bg-light py-3 px-3 px-md-4 d-flex justify-content-between flex-shrink-0">
                    <button type="button" className="btn btn-ghost-secondary px-4" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </button>

                    <button type="submit" className="btn btn-primary rounded-pill px-4 px-md-5 shadow-sm d-flex align-items-center" disabled={!isReadyToSave || isSaving}>
                        {isSaving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                <IconCheck size={18} className="me-2" />
                                Generar Eventos
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
