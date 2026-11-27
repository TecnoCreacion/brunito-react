import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog/ConfirmDialog";
import { usePlannerForm } from "../hooks/usePlannerForm";
import { usePlannerById } from "../hooks/usePlannerById";
import { useDeletePlannerMutation } from "../mutations/useDeletePlannerMutation";
import { IconX, IconPlus, IconTrash } from "@tabler/icons-react";

// -------------------------------------------------------------------------
// CAPA 1: CONTENEDOR (Controla la visibilidad global)
// -------------------------------------------------------------------------
export const PlannerModal = ({ isOpen, onClose, selectedDate, plannerId, userId }) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-blur fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content shadow-lg border-0">
                    <PlannerModalFetcher onClose={onClose} selectedDate={selectedDate} plannerId={plannerId} userId={userId} />
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// CAPA 2: COMPONENTE INTELIGENTE / FETCHER (TanStack Query)
// -------------------------------------------------------------------------
const PlannerModalFetcher = ({ onClose, selectedDate, plannerId, userId }) => {
    const {
        planner: plannerData,
        isLoading,
        isError,
    } = usePlannerById(plannerId, {
        with: ["tags", "fixedTask"],
    });

    if (plannerId && isLoading) {
        return (
            <div className="modal-body text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="mt-2 text-muted">Cargando información del evento...</div>
            </div>
        );
    }

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

    return <PlannerModalForm initialData={plannerData} selectedDate={selectedDate} userId={userId} onClose={onClose} />;
};

// -------------------------------------------------------------------------
// CAPA 3: COMPONENTE PRESENTACIONAL (El Formulario)
// -------------------------------------------------------------------------
const PlannerModalForm = ({ initialData, selectedDate, userId, onClose }) => {
    const TAG_COLOR_OPTIONS = [
        { value: "primary", label: "Azul" },
        { value: "success", label: "Verde" },
        { value: "warning", label: "Amarillo" },
        { value: "danger", label: "Rojo" },
        { value: "info", label: "Celeste" },
        { value: "purple", label: "Morado" },
        { value: "secondary", label: "Gris" },
    ];

    const [tagInput, setTagInput] = useState("");
    const [tagColor, setTagColor] = useState("primary");
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    const { mutate: deletePlannerEvent, isPending: isDeleting } = useDeletePlannerMutation(userId);

    const { title, setTitle, description, setDescription, startDate, setStartDate, startTime, setStartTime, endDate, setEndDate, endTime, setEndTime, tags, availableTags, handleAddTag, handleRemoveTag, isPending, isEditing, errors, handleSubmit } = usePlannerForm({
        initialData,
        selectedDate,
        userId,
        onClose,
    });

    const isBusy = isPending || isDeleting;

    const onAddTagClick = (tagValue) => {
        if (!tagValue) return;

        // Si viene desde "Disponibles" (ya es un objeto con id, name y color)
        if (typeof tagValue === "object") {
            handleAddTag(tagValue);
        } else {
            const cleanName = tagValue.trim();
            if (!cleanName) return;
            handleAddTag({ name: cleanName, color: tagColor });
        }

        setTagInput("");
        setTagColor("primary"); // Reinicia a azul tras agregar
    };

    const handleConfirmDelete = () => {
        if (!initialData?.id) return;

        deletePlannerEvent(initialData.id, {
            onSuccess: () => {
                setIsConfirmDeleteOpen(false);
                onClose();
            },
        });
    };

    return (
        <>
            <div className="modal-header">
                <h5 className="modal-title">{isEditing ? "Modificar Recordatorio" : "Nuevo Recordatorio"}</h5>
                <button type="button" className="btn-close" onClick={onClose} disabled={isBusy}></button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="modal-body">
                    {errors.general && <div className="alert alert-danger">{errors.general}</div>}

                    <div className="mb-3">
                        <label className="form-label required">Título del recordatorio</label>
                        <input type="text" className={`form-control ${errors.title ? "is-invalid" : ""}`} placeholder="Ej: Reunión de planificación" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isBusy} required />
                        {errors.title && <div className="invalid-feedback">{errors.title[0]}</div>}
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="card shadow-none border">
                                <div className="card-body p-3">
                                    <label className="form-label text-primary">Inicio</label>
                                    <div className="row g-2">
                                        <div className="col-7">
                                            <input type="date" className={`form-control ${errors.start_date ? "is-invalid" : ""}`} value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={isBusy} required />
                                        </div>
                                        <div className="col-5">
                                            <input type="time" className={`form-control ${errors.start_time ? "is-invalid" : ""}`} value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={isBusy} />
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
                                            <input type="date" className={`form-control ${errors.end_date ? "is-invalid" : ""}`} value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={isBusy} />
                                        </div>
                                        <div className="col-5">
                                            <input type="time" className={`form-control ${errors.end_time ? "is-invalid" : ""}`} value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={isBusy} />
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
                        <textarea className="form-control" rows="2" placeholder="Agrega notas adicionales o contexto..." value={description} onChange={(e) => setDescription(e.target.value)} disabled={isBusy}></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Etiquetas (Tags)</label>

                        <div className="input-group mb-2">
                            <span className="input-group-text bg-white">
                                <span className={`badge bg-${tagColor} p-1`} aria-hidden="true" />
                            </span>
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
                                disabled={isBusy}
                            />
                            <select className="form-select" style={{ maxWidth: "130px" }} value={tagColor} onChange={(e) => setTagColor(e.target.value)} disabled={isBusy} aria-label="Color de etiqueta">
                                {TAG_COLOR_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => onAddTagClick(tagInput)} disabled={isBusy || !tagInput.trim()}>
                                Agregar
                            </button>
                        </div>

                        {availableTags.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mb-3">
                                <span className="text-muted small me-2 align-self-center">Disponibles:</span>
                                {availableTags.map((t) => (
                                    <span key={t.id} className={`badge bg-${t.color || "primary"}-lt cursor-pointer transition-colors hover-shadow-sm d-flex align-items-center gap-1`} onClick={() => onAddTagClick(t)}>
                                        <IconPlus size={12} stroke={3} /> {t.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {tags.length === 0 && <span className="text-muted small">No hay etiquetas seleccionadas.</span>}

                            {tags.map((tag, index) => (
                                <span key={tag.id || `${tag.name}-${index}`} className={`badge bg-${tag.color || "primary"} text-white d-flex align-items-center gap-2 p-2 shadow-sm`}>
                                    {tag.name}
                                    <span style={{ cursor: "pointer", opacity: 0.8 }} onClick={() => handleRemoveTag(tag)} title="Eliminar">
                                        <IconX size={14} />
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pie del Modal: Eliminar a la izquierda (solo en edición) | Cancelar y Guardar a la derecha */}
                <div className="modal-footer bg-light d-flex justify-content-between align-items-center">
                    <div>
                        {isEditing && (
                            <Button type="button" variant="danger" outline disabled={isBusy} onClick={() => setIsConfirmDeleteOpen(true)} className="d-inline-flex align-items-center gap-1">
                                <IconTrash size={16} />
                                <span>Eliminar</span>
                            </Button>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <button type="button" className="btn btn-link link-secondary" onClick={onClose} disabled={isBusy}>
                            Cancelar
                        </button>
                        <Button type="submit" variant="primary" loading={isPending} disabled={isDeleting}>
                            {isEditing ? "Actualizar Recordatorio" : "Guardar Recordatorio"}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Diálogo Corporativo de Confirmación */}
            <ConfirmDialog isOpen={isConfirmDeleteOpen} title="Eliminar recordatorio" message={`¿Estás seguro de que deseas eliminar "${initialData?.title}"? Esta acción moverá el registro a la papelera.`} variant="danger" confirmLabel="Sí, eliminar" loading={isDeleting} onConfirm={handleConfirmDelete} onCancel={() => setIsConfirmDeleteOpen(false)} />
        </>
    );
};
