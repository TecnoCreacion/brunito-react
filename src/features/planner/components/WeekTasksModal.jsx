import { Modal } from "@/shared/components/Modal/Modal";
import { IconBriefcase, IconCheck, IconPlus, IconTrash, IconCalendarPlus, IconListCheck } from "@tabler/icons-react";
import { useWeekTasksForm } from "../hooks/useWeekTasksForm";

export const WeekTasksModal = ({ isOpen, onClose, onSave, weekNumber, availableManualTasks = [], isSaving }) => {
    // La lógica permanece aislada en el Hook, respetando la arquitectura de BrunOS
    const { selectedTaskIds, handleAddTask, handleRemoveTask, handleSave, isReadyToSave } = useWeekTasksForm(isOpen, [], onSave);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Planificar Semana ${weekNumber || ""}`} size="lg">
            {/* position-relative es crucial para que el overlay cubra solo el formulario */}
            <form onSubmit={handleSave} className="d-flex flex-column position-relative m-0">
                {/* 🚀 DISEÑO CORPORATIVO: Auto Overlay de Bloqueo */}
                {isSaving && (
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                        style={{
                            zIndex: 1050,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(2px)",
                        }}
                    >
                        <span className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status" />
                        <h4 className="text-primary fw-bold mb-0">Generando Eventos...</h4>
                        <p className="text-muted small">Sincronizando con el calendario de BrunOS</p>
                    </div>
                )}

                <div className="modal-body p-0">
                    <div className="row g-0 align-items-stretch" style={{ minHeight: "50vh" }}>
                        {/* ---------------------------------------------------
                            COLUMNA IZQUIERDA: Turnos Disponibles
                        --------------------------------------------------- */}
                        <div className="col-md-6 border-end bg-light d-flex flex-column">
                            {/* Header Estructurado */}
                            <div className="p-3 border-bottom bg-white d-flex align-items-center">
                                <span className="bg-primary-lt text-primary p-2 rounded me-3">
                                    <IconCalendarPlus size={20} />
                                </span>
                                <div>
                                    <h4 className="mb-0 text-dark">Turnos Disponibles</h4>
                                    <div className="text-muted small">Plantillas manuales configuradas</div>
                                </div>
                            </div>

                            {/* Body con Scroll Independiente */}
                            <div className="p-3 flex-grow-1 overflow-auto" style={{ maxHeight: "55vh" }}>
                                {availableManualTasks.length === 0 ? (
                                    // Empty State Corporativo[cite: 1]
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-center border border-dashed rounded bg-white">
                                        <IconBriefcase size={32} className="text-muted opacity-50 mb-2" />
                                        <span className="text-muted small fw-medium">No hay turnos manuales disponibles</span>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        {availableManualTasks.map((task) => (
                                            <div key={task.id} className="card border border-muted shadow-none hover-shadow-sm transition-all">
                                                <div className="card-body p-3 d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-1 text-dark fw-bold">{task.title}</h6>
                                                        {task.tags && task.tags.length > 0 && (
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {task.tags.map((t) => (
                                                                    <span key={t} className="badge bg-secondary-lt text-secondary border border-secondary-subtle" style={{ fontSize: "0.65rem" }}>
                                                                        {t}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button type="button" className="btn btn-sm btn-primary btn-icon rounded-circle shadow-sm flex-shrink-0 ms-2" onClick={() => handleAddTask(task.id)} disabled={isSaving} title="Agregar a la planificación">
                                                        <IconPlus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ---------------------------------------------------
                            COLUMNA DERECHA: Turnos Seleccionados
                        --------------------------------------------------- */}
                        <div className="col-md-6 d-flex flex-column bg-white">
                            {/* Header Estructurado */}
                            <div className="p-3 border-bottom d-flex align-items-center">
                                <span className="bg-success-lt text-success p-2 rounded me-3">
                                    <IconListCheck size={20} />
                                </span>
                                <div>
                                    <h4 className="mb-0 text-dark">Planificación</h4>
                                    <div className="text-muted small">Semana {weekNumber || "--"}</div>
                                </div>
                                <span className="badge bg-primary ms-auto rounded-pill px-3">{selectedTaskIds.length} turnos</span>
                            </div>

                            {/* Body con Scroll Independiente */}
                            <div className="p-3 flex-grow-1 overflow-auto bg-white" style={{ maxHeight: "55vh" }}>
                                {selectedTaskIds.length === 0 ? (
                                    // Empty State Corporativo[cite: 1]
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-center">
                                        <div className="avatar avatar-lg bg-light text-muted mb-3">
                                            <IconBriefcase size={28} />
                                        </div>
                                        <h5 className="text-dark mb-1">Sin turnos asignados</h5>
                                        <p className="text-muted small mb-0">
                                            Haz clic en el botón <IconPlus size={14} /> de la izquierda para agregar turnos a esta semana.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-2 animate-fade-in">
                                        {selectedTaskIds.map((taskId, index) => {
                                            const taskDetails = availableManualTasks.find((t) => t.id === taskId);
                                            return (
                                                <div key={`${taskId}-${index}`} className="d-flex align-items-center p-2 border rounded bg-primary-lt border-primary-subtle transition-all">
                                                    {/* Indicador visual de orden (opcional) */}
                                                    <div className="text-primary opacity-50 small fw-bold ms-1 me-3">{(index + 1).toString().padStart(2, "0")}</div>

                                                    <div className="flex-grow-1 fw-medium text-primary-emphasis" style={{ fontSize: "0.85rem" }}>
                                                        {taskDetails?.title || "Turno desconocido"}
                                                    </div>

                                                    <button type="button" className="btn btn-sm btn-icon text-danger border-0 hover:bg-danger hover:text-white transition-colors ms-2" onClick={() => handleRemoveTask(index)} disabled={isSaving} title="Quitar de la lista">
                                                        <IconTrash size={18} stroke={2} />
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

                {/* ---------------------------------------------------
                    FOOTER: Acciones (Consistentes y predecibles)
                --------------------------------------------------- */}
                <div className="modal-footer border-top bg-light py-3 d-flex justify-content-between">
                    <button type="button" className="btn btn-ghost-secondary px-4" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </button>

                    <button type="submit" className="btn btn-primary rounded-pill px-5 shadow-sm d-flex align-items-center" disabled={!isReadyToSave || isSaving}>
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
