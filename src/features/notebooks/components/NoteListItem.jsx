import { useState } from "react";
import { IconChevronUp, IconChevronDown, IconEdit, IconNotes } from "@tabler/icons-react";

// Subcomponente de uso exclusivo para las tarjetas de libretas
export const NoteListItem = ({ note, onEdit, onMoveUp, onMoveDown, isFirst, isLast, disabled }) => {
    // Estado local visual (Capa 2: Componentes) para el acordeón
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="card shadow-none border mb-2 transition-base hover-shadow-sm bg-white">
            <div className="card-body p-2 d-flex align-items-start gap-2">
                {/* Controles de Ordenamiento (Izquierda) */}
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <button className="btn btn-sm btn-icon btn-ghost-secondary p-0 mb-1" onClick={() => onMoveUp(note)} disabled={disabled || isFirst} style={{ height: "20px", width: "20px" }} title="Subir nota">
                        <IconChevronUp size={16} />
                    </button>
                    <button className="btn btn-sm btn-icon btn-ghost-secondary p-0" onClick={() => onMoveDown(note)} disabled={disabled || isLast} style={{ height: "20px", width: "20px" }} title="Bajar nota">
                        <IconChevronDown size={16} />
                    </button>
                </div>

                {/* Contenido (Centro) - Clickeable para expandir */}
                <div className="flex-grow-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)} title="Clic para ver detalles">
                    <div className="d-flex align-items-center gap-1 mb-1">
                        <IconNotes size={14} className="text-primary opacity-75" />
                        <span className="fw-semibold small text-truncate d-block" style={{ maxWidth: "90%" }}>
                            {note.title || "Sin título"}
                        </span>
                    </div>

                    {/* Detalles expandibles */}
                    {isExpanded ? (
                        <div className="text-muted small mt-2 p-2 bg-light rounded" style={{ whiteSpace: "pre-wrap" }}>
                            {note.content || "Sin descripción..."}
                        </div>
                    ) : (
                        // Vista previa de una línea si está colapsado
                        <div className="text-muted text-truncate small opacity-75" style={{ maxWidth: "90%", fontSize: "0.75rem" }}>
                            {note.content}
                        </div>
                    )}
                </div>

                {/* Acciones (Derecha) */}
                <button className="btn btn-sm btn-icon btn-ghost-primary flex-shrink-0" onClick={() => onEdit(note)} disabled={disabled} title="Editar nota">
                    <IconEdit size={16} />
                </button>
            </div>
        </div>
    );
};
