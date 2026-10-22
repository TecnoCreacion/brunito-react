import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { usePlannerForm } from "../hooks/usePlannerForm";
import { usePlannerById } from "../hooks/usePlannerById";

// -------------------------------------------------------------------------
// CAPA 1: CONTENEDOR (Controla la visibilidad global)
// -------------------------------------------------------------------------
export const PlannerModal = ({ isOpen, onClose, selectedDate, plannerId, userId }) => {
    // Si no está abierto, no renderizamos absolutamente nada.
    // Esto destruye los componentes internos al cerrar, limpiando cualquier estado.
    if (!isOpen) return null;

    return (
        <div className="modal modal-blur fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content shadow-lg border-0">
                    {/* Delegamos la obtención de datos al Fetcher */}
                    <PlannerModalFetcher onClose={onClose} selectedDate={selectedDate} plannerId={plannerId} userId={userId} />
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// CAPA 2: COMPONENTE INTELIGENTE / FETCHER (TanStack Query)
// Coordina la lógica de negocio remota antes de pintar el formulario[cite: 2].
// -------------------------------------------------------------------------
const PlannerModalFetcher = ({ onClose, selectedDate, plannerId, userId }) => {
    // 🚀 ARQUITECTURA: TanStack Query obtiene los datos frescos de Laravel.
    // Solo bloqueamos el renderizado si hay un ID (Modo Edición).
    const {
        planner: plannerData,
        isLoading,
        isError,
    } = usePlannerById(plannerId, {
        with: ["tags", "fixedTask"],
    });

    // 🚀 MANEJO DE ESTADOS VISUALES (Infraestructura)
    // Bloqueamos el paso a la Capa 3 hasta que los datos estén listos.
    if (plannerId && isLoading) {
        return (
            <div className="modal-body text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="mt-2 text-muted">Cargando información del evento...</div>
            </div>
        );
    }

    // 2. Registro inexistente o Error de red
    if (isError || (plannerId && !isLoading && !plannerData)) {
        return (
            <div className="modal-body text-center py-5">
                <div className="alert alert-warning border-0 shadow-sm" role="alert">
                    <h4 className="alert-title mb-1">Registro no disponible</h4>

                    <div className="text-secondary">No se pudo encontrar el registro solicitado.</div>
                </div>

                <button type="button" className="btn btn-secondary mt-2" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        );
    }

    // 3. Render del Formulario con datos garantizados
    return <PlannerModalForm initialData={plannerData} selectedDate={selectedDate} userId={userId} onClose={onClose} />;
};

// -------------------------------------------------------------------------
// CAPA 3: COMPONENTE PRESENTACIONAL (El Formulario)
// Solo renderiza información y gestiona el estado local. No conoce el Backend[cite: 2].
// -------------------------------------------------------------------------
const PlannerModalForm = ({ initialData, selectedDate, userId, onClose }) => {
    const [tagInput, setTagInput] = useState("");

    // El hook de formulario ahora SIEMPRE recibe la data fresca desde el primer renderizado
    const { title, setTitle, description, setDescription, startDate, setStartDate, startTime, setStartTime, endDate, setEndDate, endTime, setEndTime, tags, handleAddTag, handleRemoveTag, isPending, isEditing, errors, handleSubmit } = usePlannerForm({
        initialData,
        selectedDate,
        userId,
        onClose,
    });

    const recommendedTags = ["importante", "médico", "trabajo", "familia", "urgente", "reunión", "proyecto"];
    const availableTags = recommendedTags.filter((t) => !tags.includes(t));

    const onAddTagClick = (tag) => {
        handleAddTag(tag);
        setTagInput("");
    };

    return (
        <>
            <div className="modal-header">
                <h5 className="modal-title">{isEditing ? "Modificar Recordatorio" : "Nuevo Recordatorio"}</h5>

                <button type="button" className="btn-close" onClick={onClose} disabled={isPending}></button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="modal-body">
                    {errors.general && <div className="alert alert-danger">{errors.general}</div>}

                    <div className="mb-3">
                        <label className="form-label required">Título del recordatorio</label>

                        <input type="text" className={`form-control ${errors.title ? "is-invalid" : ""}`} placeholder="Ej: Reunión de planificación" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} required />
                        {errors.title && <div className="invalid-feedback">{errors.title[0]}</div>}
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="card shadow-none border">
                                <div className="card-body p-3">
                                    <label className="form-label text-primary">Inicio</label>

                                    <div className="row g-2">
                                        <div className="col-7">
                                            <input type="date" className={`form-control ${errors.start_date ? "is-invalid" : ""}`} value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={isPending} required />
                                        </div>

                                        <div className="col-5">
                                            <input type="time" className={`form-control ${errors.start_time ? "is-invalid" : ""}`} value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={isPending} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card shadow-none border">
                                <div className="card-body p-3">
                                    <label className="form-label text-secondary">Finalización (Opcional)</label>

                                    <div className="row g-2">
                                        <div className="col-7">
                                            <input type="date" className={`form-control ${errors.end_date ? "is-invalid" : ""}`} value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={isPending} />
                                        </div>

                                        <div className="col-5">
                                            <input type="time" className={`form-control ${errors.end_time ? "is-invalid" : ""}`} value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={isPending} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(errors.start_date || errors.end_date) && (
                            <div className="col-12 mt-1">
                                <small className="text-danger">Revisa las fechas ingresadas. La fecha final no puede ser menor a la de inicio.</small>
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripción (Opcional)</label>

                        <textarea className="form-control" rows="2" placeholder="Agrega notas adicionales o contexto..." value={description} onChange={(e) => setDescription(e.target.value)} disabled={isPending}></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Etiquetas (Tags)</label>

                        <div className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Escribe una etiqueta y presiona Enter"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        onAddTagClick(tagInput);
                                    }
                                }}
                                disabled={isPending}
                            />

                            <button type="button" className="btn btn-outline-secondary" onClick={() => onAddTagClick(tagInput)} disabled={isPending || !tagInput.trim()}>
                                Agregar
                            </button>
                        </div>

                        {availableTags.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mb-3">
                                <span className="text-muted small me-2 align-self-center">Sugerencias:</span>
                                {availableTags.map((t) => (
                                    <span key={t} className="badge bg-secondary-lt cursor-pointer transition-colors hover:bg-secondary hover:text-white" onClick={() => onAddTagClick(t)} style={{ cursor: "pointer" }}>
                                        + {t}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {tags.length === 0 && <span className="text-muted small">No hay etiquetas seleccionadas.</span>}
                            {tags.map((tag) => (
                                <span key={tag} className="badge bg-primary text-white d-flex align-items-center gap-2 p-2">
                                    {tag}
                                    <span style={{ cursor: "pointer", opacity: 0.8 }} onClick={() => handleRemoveTag(tag)}>
                                        &times;
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="modal-footer bg-light">
                    <button type="button" className="btn btn-link link-secondary" onClick={onClose} disabled={isPending}>
                        Cancelar
                    </button>

                    <Button type="submit" variant="primary" loading={isPending}>
                        {isEditing ? "Actualizar Recordatorio" : "Guardar Recordatorio"}
                    </Button>
                </div>
            </form>
        </>
    );
};
