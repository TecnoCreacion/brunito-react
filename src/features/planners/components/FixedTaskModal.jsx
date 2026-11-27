import { useState } from "react";
import { Modal } from "@/shared/components/Modal/Modal";
import { Button } from "@/shared/components/Button";
import { IconBriefcase, IconCalendarDollar, IconArrowRight, IconArrowLeft, IconCheck, IconClock, IconBook2, IconPlus, IconTrash, IconTags, IconX } from "@tabler/icons-react";
import { useFixedTaskForm } from "../hooks/useFixedTaskForm";

const WEEK_DAYS = [
    { id: 1, label: "L" },
    { id: 2, label: "M" },
    { id: 3, label: "X" },
    { id: 4, label: "J" },
    { id: 5, label: "V" },
    { id: 6, label: "S" },
    { id: 7, label: "D" },
];

const TAG_COLOR_OPTIONS = [
    { value: "primary", label: "Azul" },
    { value: "success", label: "Verde" },
    { value: "warning", label: "Amarillo" },
    { value: "danger", label: "Rojo" },
    { value: "info", label: "Celeste" },
    { value: "purple", label: "Morado" },
    { value: "secondary", label: "Gris" },
];

export const FixedTaskModal = ({ isOpen, onClose, notebooks = [], availableTags = [], onSave, initialData = null, isSaving = false }) => {
    const [tagInput, setTagInput] = useState("");
    const [tagColor, setTagColor] = useState("primary");

    const { formData, step, setStep, handleChange, handleAddSchedule, handleRemoveSchedule, handleScheduleChange, handleToggleDay, handleNextStep, unselectedSuggestions, handleAddTag, handleRemoveTag, handleReset, handleSubmit, isEditing } = useFixedTaskForm({
        initialData,
        isOpen,
        availableTags,
        onSubmitCallback: (payload) => onSave(payload),
    });

    const handleClose = () => {
        setTagInput("");
        setTagColor("primary");
        handleReset();
        onClose();
    };

    const onAddTagClick = (tagValue) => {
        if (!tagValue || isSaving) return;

        if (typeof tagValue === "object") {
            handleAddTag(tagValue);
        } else {
            const cleanName = tagValue.trim();
            if (!cleanName) return;
            handleAddTag({ name: cleanName, color: tagColor });
        }

        setTagInput("");
        setTagColor("primary");
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? "Editar Tarea Recurrente" : "Configurar Tarea Recurrente"} size="lg">
            <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1 overflow-hidden">
                <div className="modal-body p-0 overflow-y-auto">
                    <div className="progress progress-sm rounded-0">
                        <div className={`progress-bar ${step === 1 ? "w-50" : "w-100"} transition-all bg-primary`} />
                    </div>

                    <div className="p-4 p-md-5">
                        {step === 1 && (
                            <div className="text-center animate-fade-in">
                                <h2 className="h4 mb-2">¿Qué tipo de tarea deseas automatizar?</h2>
                                <p className="text-muted mb-4 small">Selecciona el comportamiento que mejor se adapte a tu necesidad.</p>

                                <div className="row g-4 justify-content-center">
                                    <div className="col-sm-6">
                                        <label className={`form-imagecheck w-100 mb-0 ${isSaving ? "opacity-50" : ""}`}>
                                            <input name="recurrence_type" type="radio" value="work_shift" className="form-imagecheck-input" checked={formData.recurrence_type === "work_shift"} onChange={() => handleChange("recurrence_type", "work_shift")} disabled={isSaving} />
                                            <span className="form-imagecheck-figure p-4 rounded-4 text-center border transition-base cursor-pointer bg-white">
                                                <IconBriefcase size={40} className="text-primary mb-2" stroke={1.5} />
                                                <h5 className="mb-1 text-dark">Horario Laboral</h5>
                                                <span className="d-block text-muted small">Turnos o jornadas diarias</span>
                                            </span>
                                        </label>
                                    </div>

                                    <div className="col-sm-6">
                                        <label className={`form-imagecheck w-100 mb-0 ${isSaving ? "opacity-50" : ""}`}>
                                            <input name="recurrence_type" type="radio" value="monthly_reminder" className="form-imagecheck-input" checked={formData.recurrence_type === "monthly_reminder"} onChange={() => handleChange("recurrence_type", "monthly_reminder")} disabled={isSaving} />
                                            <span className="form-imagecheck-figure p-4 rounded-4 text-center border transition-base cursor-pointer bg-white">
                                                <IconCalendarDollar size={40} className="text-success mb-2" stroke={1.5} />
                                                <h5 className="mb-1 text-dark">Hito Mensual</h5>
                                                <span className="d-block text-muted small">Días de pago o cierres</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <Button type="button" variant="primary" className="rounded-pill px-5" disabled={!formData.recurrence_type || isSaving} onClick={handleNextStep}>
                                        Continuar <IconArrowRight size={16} className="ms-2" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in">
                                {!isEditing && (
                                    <button type="button" className="btn btn-link text-muted px-0 mb-4 text-decoration-none d-flex align-items-center" onClick={() => setStep(1)} disabled={isSaving}>
                                        <IconArrowLeft size={16} className="me-2" /> Cambiar tipo
                                    </button>
                                )}

                                <div className="row g-4">
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            Nombre descriptivo <span className="text-danger">*</span>
                                        </label>
                                        <input type="text" className="form-control bg-light border-0" placeholder="Ej: Turno Mañana" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} disabled={isSaving} required />
                                    </div>

                                    {formData.recurrence_type === "work_shift" && (
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="text-primary d-flex align-items-center gap-2 mb-0">
                                                    <IconClock size={18} /> Configuración de Horarios
                                                </h6>
                                            </div>

                                            {formData.schedules.map((schedule, index) => (
                                                <div key={index} className="card border bg-light-subtle rounded-3 p-3 mb-3 position-relative">
                                                    {formData.schedules.length > 1 && (
                                                        <button type="button" className="btn btn-sm btn-icon btn-outline-danger position-absolute top-0 end-0 m-2 border-0" onClick={() => handleRemoveSchedule(index)} disabled={isSaving} title="Eliminar horario">
                                                            <IconTrash size={16} />
                                                        </button>
                                                    )}
                                                    <div className="row g-3">
                                                        <div className="col-12">
                                                            <label className="form-label text-muted small text-uppercase">Días ({index + 1})</label>
                                                            <div className="btn-group w-100" role="group">
                                                                {WEEK_DAYS.map((day) => (
                                                                    <button key={day.id} type="button" onClick={() => handleToggleDay(index, day.id)} disabled={isSaving} className={`btn btn-sm ${schedule.days_of_week.includes(day.id) ? "btn-primary" : "btn-outline-secondary bg-white"}`}>
                                                                        {day.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <label className="form-label text-muted small text-uppercase">Inicio</label>
                                                            <input type="time" className="form-control" value={schedule.start_time} onChange={(e) => handleScheduleChange(index, "start_time", e.target.value)} disabled={isSaving} required />
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <label className="form-label text-muted small text-uppercase">Fin</label>
                                                            <input type="time" className="form-control" value={schedule.end_time} onChange={(e) => handleScheduleChange(index, "end_time", e.target.value)} disabled={isSaving} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <button type="button" className="btn btn-outline-primary btn-sm w-100 border-dashed" onClick={handleAddSchedule} disabled={isSaving}>
                                                <IconPlus size={16} className="me-1" /> Agregar otro horario
                                            </button>

                                            <div className="mt-3">
                                                <label className="form-label text-muted small">Rotación</label>
                                                <select className="form-select" value={formData.rotation_week} onChange={(e) => handleChange("rotation_week", e.target.value)} disabled={isSaving}>
                                                    <option value="">Selección manual</option>
                                                    <option value="1">Aplica todas las semanas (Fijo)</option>
                                                    <option value="2">Semana A (Impares)</option>
                                                    <option value="3">Semana B (Pares)</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {formData.recurrence_type === "monthly_reminder" && (
                                        <div className="col-12">
                                            <div className="card border-0 bg-success-subtle rounded-3 p-4">
                                                <div className="row g-3 align-items-center">
                                                    <div className="col-sm-6">
                                                        <label className="form-label text-success-emphasis fw-medium">Día del mes</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text bg-white">Día</span>
                                                            <input type="number" className="form-control border-start-0" min="1" max="31" placeholder="Ej: 5" value={formData.day_of_month} onChange={(e) => handleChange("day_of_month", e.target.value)} disabled={isSaving} required />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label className="form-check form-switch cursor-pointer mt-sm-4 pt-1">
                                                            <input className="form-check-input" type="checkbox" checked={formData.requires_business_day} onChange={(e) => handleChange("requires_business_day", e.target.checked)} disabled={isSaving} />
                                                            <span className="form-check-label text-success-emphasis fw-medium">Exigir día hábil</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-12">
                                        <label className="form-label text-muted d-flex align-items-center gap-2">
                                            <IconBook2 size={16} /> Vincular a Libreta (Opcional)
                                        </label>
                                        <select className="form-select" value={formData.notebook_id} onChange={(e) => handleChange("notebook_id", e.target.value)} disabled={isSaving}>
                                            <option value="">-- Sin vincular --</option>
                                            {notebooks.map((nb) => (
                                                <option key={nb.id} value={nb.id}>
                                                    {nb.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Etiquetas con selector de color en la misma línea */}
                                    <div className="col-12 mt-4 pt-3 border-top">
                                        <label className="form-label text-muted d-flex align-items-center gap-2">
                                            <IconTags size={16} /> Etiquetas (Tags)
                                        </label>

                                        <div className="input-group mb-2 shadow-sm">
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
                                                disabled={isSaving}
                                            />
                                            <select className="form-select" style={{ maxWidth: "130px" }} value={tagColor} onChange={(e) => setTagColor(e.target.value)} disabled={isSaving} aria-label="Color de etiqueta">
                                                {TAG_COLOR_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <button type="button" className="btn btn-outline-secondary" onClick={() => onAddTagClick(tagInput)} disabled={isSaving || !tagInput.trim()}>
                                                Agregar
                                            </button>
                                        </div>

                                        {/* Sugerencias con color */}
                                        {unselectedSuggestions.length > 0 && (
                                            <div className="d-flex flex-wrap gap-1 mb-3">
                                                <span className="text-muted small me-2 align-self-center">Sugerencias:</span>
                                                {unselectedSuggestions.map((t) => (
                                                    <span key={t.id} className={`badge bg-${t.color || "primary"}-lt transition-colors d-flex align-items-center gap-1 ${isSaving ? "opacity-50" : "cursor-pointer hover-shadow-sm"}`} onClick={() => onAddTagClick(t)}>
                                                        <IconPlus size={12} stroke={3} /> {t.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Etiquetas Seleccionadas con color */}
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {(!formData.tags || formData.tags.length === 0) && <span className="text-muted small">No hay etiquetas seleccionadas.</span>}

                                            {formData.tags?.map((tag, index) => (
                                                <span key={tag.id || `${tag.name}-${index}`} className={`badge bg-${tag.color || "primary"} text-white d-flex align-items-center gap-2 p-2 shadow-sm`}>
                                                    {tag.name}
                                                    <span
                                                        style={{
                                                            cursor: isSaving ? "not-allowed" : "pointer",
                                                            opacity: 0.85,
                                                        }}
                                                        onClick={() => !isSaving && handleRemoveTag(tag)}
                                                        title="Quitar etiqueta"
                                                    >
                                                        <IconX size={14} />
                                                    </span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {step === 2 && (
                    <div className="modal-footer border-top-0 bg-light py-3 px-4 px-md-5">
                        <button type="button" className="btn btn-link text-muted text-decoration-none" onClick={handleClose} disabled={isSaving}>
                            Cancelar
                        </button>

                        <Button type="submit" variant="primary" loading={isSaving} className="rounded-pill px-4 shadow-sm">
                            {!isSaving && <IconCheck size={16} className="me-2" />}
                            {isEditing ? "Actualizar Tarea" : "Guardar Configuración"}
                        </Button>
                    </div>
                )}
            </form>
        </Modal>
    );
};
