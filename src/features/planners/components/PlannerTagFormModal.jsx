import { IconTag, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { usePlannerTagForm, TAG_COLOR_OPTIONS } from "../hooks/usePlannerTagForm";

export const PlannerTagFormModal = ({ isOpen, initialData = null, onClose }) => {
    const { name, setName, color, setColor, errors, isPending, isEditing, handleSubmit } = usePlannerTagForm({
        initialData,
        isOpen,
        onClose,
    });

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop fade show" />
            <div className="modal modal-blur fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
                    <form className="modal-content shadow" onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title d-flex align-items-center gap-2">
                                <IconTag size={18} className="text-primary" />
                                {isEditing ? "Editar Etiqueta" : "Nueva Etiqueta"}
                            </h5>
                            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} disabled={isPending} />
                        </div>

                        <div className="modal-body">
                            {errors.general && (
                                <div className="alert alert-danger py-2 small" role="alert">
                                    {errors.general}
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label required">Nombre</label>
                                <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder="Ej: Urgente, Reunión..." value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} autoFocus />
                                {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                            </div>

                            <div className="mb-2">
                                <label className="form-label">Color distintivo</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {TAG_COLOR_OPTIONS.map((option) => {
                                        const isSelected = color === option.value;
                                        return (
                                            <button key={option.value} type="button" onClick={() => setColor(option.value)} className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 ${isSelected ? `btn-${option.value}` : `btn-outline-${option.value}`}`} title={option.label} disabled={isPending}>
                                                <span className={`badge bg-${option.value} rounded-circle p-1`} style={{ width: "8px", height: "8px" }} />
                                                <span className="small">{option.label.split(" ")[0]}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.color && <div className="text-danger small mt-1">{errors.color[0]}</div>}
                            </div>

                            {/* Vista previa en tiempo real */}
                            <div className="mt-3 pt-2 border-top d-flex align-items-center justify-content-between">
                                <span className="text-muted small">Vista previa:</span>
                                <span className={`badge bg-${color} text-white px-2 py-1`}>{name.trim() || "Etiqueta"}</span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-link link-secondary" onClick={onClose} disabled={isPending}>
                                <IconX size={16} className="me-1" />
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary ms-auto" disabled={isPending}>
                                <IconDeviceFloppy size={16} className="me-1" />
                                {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
