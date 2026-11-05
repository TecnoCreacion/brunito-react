import { useState } from "react";
import { IconChevronUp, IconChevronDown, IconEdit, IconNotes, IconCheck, IconX } from "@tabler/icons-react";

// 🚀 ARQUITECTURA: Subcomponente exclusivo de la Feature 'notebooks'
export const NoteListItem = ({ note, onEdit, onMoveUp, onMoveDown, isFirst, isLast, disabled }) => {
    // 🚀 ESTADOS DE UI (Capa 2): Acordeón y Modo Edición
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Estados del formulario local
    const [editTitle, setEditTitle] = useState(note.title || "");
    const [editContent, setEditContent] = useState(note.content || note.description || "");

    // Guardar invoca la mutación (Capa 3 y 4) y cierra el formulario local
    const handleSave = () => {
        if (onEdit) {
            onEdit({ ...note, title: editTitle, content: editContent, description: editContent });
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(note.title || "");
        setEditContent(note.content || note.description || "");
        setIsEditing(false);
    };

    // 🚀 RENDER 1: MODO EDICIÓN (Formulario Inline)
    if (isEditing) {
        return (
            <div className="card shadow-none border border-primary mb-2 transition-base bg-white">
                <div className="card-body p-2">
                    <input type="text" className="form-control form-control-sm mb-2 fw-bold border-secondary-subtle" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Título de la nota..." disabled={disabled} autoFocus />
                    <textarea className="form-control form-control-sm mb-2 border-secondary-subtle hide-scrollbar" value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Contenido de la nota..." rows="3" disabled={disabled} style={{ resize: "none" }} />
                    <div className="d-flex justify-content-end gap-2 mt-2">
                        <button className="btn btn-sm btn-ghost-secondary d-flex align-items-center" onClick={handleCancel} disabled={disabled}>
                            <IconX size={16} className="me-1" /> Cancelar
                        </button>
                        <button className="btn btn-sm btn-primary d-flex align-items-center" onClick={handleSave} disabled={disabled || !editTitle.trim()}>
                            <IconCheck size={16} className="me-1" /> Guardar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 🚀 RENDER 2: MODO LECTURA (Tu diseño original fusionado)
    return (
        <div className={`card shadow-none border mb-2 transition-base hover-shadow-sm bg-white ${disabled ? "opacity-50" : ""}`}>
            <div className="card-body p-2 d-flex align-items-start gap-2">
                {/* Controles de Ordenamiento (Izquierda) */}
                <div className="d-flex flex-column align-items-center justify-content-center flex-shrink-0">
                    <button className="btn btn-sm btn-icon btn-ghost-secondary p-0 mb-1" onClick={() => onMoveUp && onMoveUp(note)} disabled={disabled || isFirst} style={{ height: "20px", width: "20px" }} title="Subir nota">
                        <IconChevronUp size={16} />
                    </button>
                    <button className="btn btn-sm btn-icon btn-ghost-secondary p-0" onClick={() => onMoveDown && onMoveDown(note)} disabled={disabled || isLast} style={{ height: "20px", width: "20px" }} title="Bajar nota">
                        <IconChevronDown size={16} />
                    </button>
                </div>

                {/* Contenido (Centro) - Clickeable para expandir */}
                <div className="flex-grow-1 cursor-pointer overflow-hidden" onClick={() => setIsExpanded(!isExpanded)} title="Clic para ver detalles">
                    <div className="d-flex align-items-center gap-1 mb-1">
                        <IconNotes size={14} className="text-primary opacity-75 flex-shrink-0" />
                        <span className="fw-semibold small text-truncate d-block" style={{ maxWidth: "95%" }}>
                            {note.title || "Sin título"}
                        </span>
                    </div>

                    {/* Detalles expandibles */}
                    {isExpanded ? (
                        <div className="text-muted small mt-2 p-2 bg-light rounded border border-dashed border-secondary-subtle" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {note.content || note.description || "Sin descripción..."}
                        </div>
                    ) : (
                        // Vista previa de una línea si está colapsado
                        <div className="text-muted text-truncate small opacity-75" style={{ maxWidth: "95%", fontSize: "0.75rem" }}>
                            {note.content || note.description}
                        </div>
                    )}
                </div>

                {/* Acciones (Derecha) */}
                <button className="btn btn-sm btn-icon btn-ghost-primary flex-shrink-0 mt-1" onClick={() => setIsEditing(true)} disabled={disabled} title="Editar nota rápida">
                    <IconEdit size={16} />
                </button>
            </div>
        </div>
    );
};
