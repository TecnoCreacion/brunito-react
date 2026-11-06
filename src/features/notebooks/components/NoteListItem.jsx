import { useState } from "react";
import { IconChevronUp, IconChevronDown, IconEdit, IconNotes, IconCheck, IconX, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { alerts } from "@/shared/utils/alerts"; // 🚀 ARQUITECTURA: Helper global para confirmaciones[cite: 7]

export const NoteListItem = ({ note, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast, disabled }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // 🚀 NUEVO ESTADO REACTIVO: Gobernamos el dropdown manualmente para evitar fallos de Bootstrap
    const [showDropdown, setShowDropdown] = useState(false);

    // 🚀 ESTADOS LOCALES: Control de la UI durante llamadas a la API
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [editTitle, setEditTitle] = useState(note.title || "");
    const [editContent, setEditContent] = useState(note.content || note.description || "");

    const handleSave = async () => {
        if (onEdit) {
            setIsSaving(true);
            const success = await onEdit({
                ...note,
                title: editTitle,
                content: editContent,
                description: editContent,
            });
            setIsSaving(false);
            if (success) setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        const isConfirmed = await alerts.confirmDelete("¿Eliminar esta nota?", "Esta acción es irreversible y se eliminará del tablero.");
        if (!isConfirmed) return;

        if (onDelete) {
            setIsDeleting(true);
            await onDelete(note);
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(note.title || "");
        setEditContent(note.content || note.description || "");
        setIsEditing(false);
    };

    if (isEditing) {
        const isInputDisabled = disabled || isSaving || isDeleting;

        return (
            <div className="card shadow-none border border-primary mb-2 transition-base bg-white">
                <div className="card-body p-2">
                    <input type="text" className="form-control form-control-sm mb-2 fw-bold border-secondary-subtle" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Título de la nota..." disabled={isInputDisabled} autoFocus />
                    <textarea className="form-control form-control-sm mb-2 border-secondary-subtle hide-scrollbar" value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Contenido de la nota..." rows="3" disabled={isInputDisabled} style={{ resize: "none" }} />
                    <div className="d-flex justify-content-end gap-2 mt-2">
                        <button className="btn btn-sm btn-ghost-secondary d-flex align-items-center" onClick={handleCancel} disabled={isInputDisabled}>
                            <IconX size={16} className="me-1" /> Cancelar
                        </button>
                        <button className="btn btn-sm btn-primary d-flex align-items-center" onClick={handleSave} disabled={isInputDisabled || !editTitle.trim()}>
                            {isSaving ? <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> : <IconCheck size={16} className="me-1" />}
                            {isSaving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isItemDisabled = disabled || isDeleting;

    return (
        <div className={`card shadow-none border mb-2 transition-base hover-shadow-sm bg-white ${isItemDisabled ? "opacity-50" : ""}`}>
            <div className="card-body p-2 d-flex align-items-start gap-2">
                <div className="d-flex flex-column align-items-center justify-content-center flex-shrink-0">
                    <button className="btn btn-sm btn-icon btn-ghost-secondary p-0 mb-1" onClick={() => onMoveUp && onMoveUp(note)} disabled={isItemDisabled || isFirst} style={{ height: "20px", width: "20px" }} title="Subir nota">
                        <IconChevronUp size={16} />
                    </button>
                    <button className="btn btn-sm btn-icon btn-ghost-secondary p-0" onClick={() => onMoveDown && onMoveDown(note)} disabled={isItemDisabled || isLast} style={{ height: "20px", width: "20px" }} title="Bajar nota">
                        <IconChevronDown size={16} />
                    </button>
                </div>

                <div className="flex-grow-1 cursor-pointer overflow-hidden" onClick={() => setIsExpanded(!isExpanded)} title="Clic para ver detalles">
                    <div className="d-flex align-items-center gap-1 mb-1">
                        <IconNotes size={14} className="text-primary opacity-75 flex-shrink-0" />
                        <span className="fw-semibold small text-truncate d-block" style={{ maxWidth: "95%" }}>
                            {note.title || "Sin título"}
                        </span>
                    </div>
                    {isExpanded ? (
                        <div className="text-muted small mt-2 p-2 bg-light rounded border border-dashed border-secondary-subtle" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {note.content || note.description || "Sin descripción..."}
                        </div>
                    ) : (
                        <div className="text-muted text-truncate small opacity-75" style={{ maxWidth: "95%", fontSize: "0.75rem" }}>
                            {note.content || note.description}
                        </div>
                    )}
                </div>

                {/* 🚀 ARQUITECTURA: Dropdown controlado 100% por React. Sin dependencias externas[cite: 7] */}
                <div className="dropdown flex-shrink-0 mt-1 position-relative">
                    <button
                        className="btn btn-sm btn-icon btn-ghost-secondary p-0"
                        onClick={() => setShowDropdown(!showDropdown)}
                        // El setTimeout garantiza que el onMouseDown de los botones interiores se registre antes de cerrar
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        disabled={isItemDisabled}
                        title="Opciones de la nota"
                    >
                        {isDeleting ? <span className="spinner-border spinner-border-sm text-danger" role="status" aria-hidden="true"></span> : <IconDotsVertical size={16} />}
                    </button>

                    {/* Al inyectar la clase 'show', emulamos perfectamente el comportamiento de Bootstrap */}
                    <ul className={`dropdown-menu dropdown-menu-end shadow-sm ${showDropdown ? "show" : ""}`} style={{ position: "absolute", right: 0, top: "100%", zIndex: 1050 }}>
                        <li>
                            <button
                                className="dropdown-item d-flex align-items-center gap-2"
                                // ⚠️ Usamos onMouseDown porque en el ciclo de JS, ocurre ANTES que onBlur
                                onMouseDown={() => {
                                    setIsEditing(true);
                                    setShowDropdown(false);
                                }}
                            >
                                <IconEdit size={14} /> Editar nota
                            </button>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li>
                            <button
                                className="dropdown-item text-danger d-flex align-items-center gap-2"
                                onMouseDown={() => {
                                    handleDelete();
                                    setShowDropdown(false);
                                }}
                            >
                                <IconTrash size={14} /> Eliminar nota
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
