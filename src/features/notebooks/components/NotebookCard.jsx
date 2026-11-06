import { useState } from "react";
import { IconPaperclip, IconTrash, IconEdit, IconPlus, IconPin, IconPinFilled, IconSearch, IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";
import { Tooltip } from "@/shared/components/Tooltip/Tooltip";
import { NoteListItem } from "./NoteListItem";
import { alerts } from "@/shared/utils/alerts"; // 🚀 Importación del helper corporativo[cite: 1]

export const NotebookCard = ({ notebook, isBeingDragged = false, dragDirection = null, onDragStart, deletingId = null, canPinMore = true, onTogglePin, onEdit, onDelete, onAddNote, onEditNote, onDeleteNote, onReorderNote, isMobileLayout = false }) => {
    // 🚀 ADAPTER (Deuda Técnica temporal)[cite: 1]
    const isPinned = notebook.isPinned !== undefined ? notebook.isPinned : notebook.is_pinned;
    const colorTheme = notebook.colorTheme || notebook.color_theme;

    const [searchTerm, setSearchTerm] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    const isThisDeleting = deletingId === notebook.id;
    const notebookNotes = notebook.notes || [];

    const isSearching = searchTerm.trim().length > 0;

    const filteredNotes = notebookNotes.filter((note) => {
        const term = searchTerm.toLowerCase();
        const titleMatch = note.title?.toLowerCase().includes(term);
        const contentMatch = (note.description || note.content)?.toLowerCase().includes(term);
        return titleMatch || contentMatch;
    });

    const maxLimit = isPinned && !isMobileLayout ? 10 : 5;
    const hasMoreNotes = filteredNotes.length > maxLimit;

    const visibleNotes = hasMoreNotes && !isExpanded && !isSearching ? filteredNotes.slice(0, maxLimit) : filteredNotes;

    const getThemeClass = (theme) => {
        switch (theme) {
            case "white-blank":
                return "bg-white text-dark border-light";
            case "yellow-lined":
            default:
                return "bg-warning-subtle text-dark border-warning-subtle";
        }
    };

    // 🚀 LÓGICA DE NEGOCIO VISUAL: Interceptamos el clic para confirmar ANTES de desfijar[cite: 1]
    const handleTogglePinClick = async () => {
        if (isPinned) {
            const isConfirmed = await alerts.confirmDelete("¿Desfijar libreta?", "La libreta volverá a su tamaño normal en el tablero y dejará de ser la principal.");
            if (!isConfirmed) return;
        }
        if (onTogglePin) onTogglePin(notebook.id, !isPinned);
    };

    return (
        <div
            className={`card shadow-sm position-relative p-3 h-100 notebook-card flex-column d-flex ${getThemeClass(colorTheme)} ${isThisDeleting ? "opacity-50" : ""}`}
            style={{
                borderRadius: "4px",
                boxShadow: isPinned ? "0 0 0 2px var(--bs-primary), 0 4px 6px rgba(0,0,0,0.07)" : isBeingDragged ? "0 10px 15px rgba(0,0,0,0.15)" : "0 4px 6px rgba(0,0,0,0.07)",
                borderTop: isPinned ? "none" : "3px solid rgba(0,0,0,0.1)",
                zIndex: isBeingDragged ? 100 : isPinned ? 50 : 1,
            }}
        >
            {/* ... BORDES DE RESIZE Y ICONO SUPERIOR (Igual que en la iteración anterior) ... */}
            {!isMobileLayout && onDragStart && (
                <div
                    className="position-absolute top-0 end-0 h-100 transition-base"
                    style={{ width: "8px", cursor: "ew-resize", zIndex: 10, backgroundColor: isBeingDragged && dragDirection === "right" ? "var(--bs-primary)" : "transparent", borderTopRightRadius: "4px", borderBottomRightRadius: "4px" }}
                    onMouseDown={(e) => onDragStart(e, notebook, "right")}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(13, 110, 253, 0.5)")}
                    onMouseLeave={(e) => {
                        if (!(isBeingDragged && dragDirection === "right")) e.target.style.backgroundColor = "transparent";
                    }}
                    title={`Arrastrar para ajustar ancho ${isPinned ? "(Máx 50%)" : ""}`}
                />
            )}

            {!isMobileLayout && (
                <div className="position-absolute top-0 start-50 translate-middle-x px-3" style={{ marginTop: "-12px", color: "#6c757d", cursor: isPinned ? "default" : "grab", zIndex: 5 }} title={isPinned ? "Libreta fijada" : "Arrastrar libreta"}>
                    {isPinned ? <IconPinFilled size={24} className="text-primary" /> : <IconPaperclip size={24} className="transform-rotate-45 text-secondary opacity-75" />}
                </div>
            )}

            <div className="card-body d-flex flex-column pt-2 p-0 mt-1 h-100 overflow-hidden">
                <div className="d-flex justify-content-between align-items-start mb-2 flex-shrink-0">
                    <h3 className="card-title h5 font-weight-bold text-truncate mb-0" style={{ maxWidth: "60%" }}>
                        {notebook.title || "Sin título"}
                    </h3>

                    <div className="d-flex gap-1 position-relative" style={{ zIndex: 15 }}>
                        {/* 🚀 COMPOSICIÓN: Inyectamos nuestra función con confirmación */}
                        <Tooltip content={isPinned ? "Desfijar libreta" : canPinMore ? "Fijar a la izquierda (Máx 1)" : "Solo puedes fijar una libreta"} position="top">
                            <button className={`btn btn-sm btn-icon ${isPinned ? "btn-primary" : "btn-ghost-secondary"}`} onClick={handleTogglePinClick} disabled={isThisDeleting || isBeingDragged || (!isPinned && !canPinMore)}>
                                {isPinned ? <IconPinFilled size={16} /> : <IconPin size={16} />}
                            </button>
                        </Tooltip>

                        <button className="btn btn-sm btn-icon btn-ghost-secondary" onClick={() => onEdit && onEdit(notebook)} disabled={isThisDeleting || isBeingDragged} title="Editar libreta">
                            <IconEdit size={16} />
                        </button>
                        <button className="btn btn-sm btn-icon btn-ghost-danger" onClick={() => onDelete && onDelete(notebook.id)} disabled={isThisDeleting || isBeingDragged} title="Eliminar libreta">
                            {isThisDeleting ? <span className="spinner-border spinner-border-sm text-danger" role="status"></span> : <IconTrash size={16} />}
                        </button>
                    </div>
                </div>

                <hr className="my-2 opacity-25 flex-shrink-0" />

                <div className="d-flex flex-column gap-2 mb-3 flex-shrink-0" style={{ zIndex: 15, position: "relative" }}>
                    <Tooltip content={`Lienzo para '${notebook.title}'.`} position="top">
                        <div className="w-100 cursor-pointer p-2 rounded transition-base border border-dashed border-secondary-subtle bg-light bg-opacity-50 hover-bg-light text-center" onClick={() => !isBeingDragged && onAddNote && onAddNote(notebook)}>
                            <p className="card-text text-muted small mb-1 text-truncate">{notebook.description || "Espacio de notas libre..."}</p>
                            <span className="text-primary small fw-semibold d-flex align-items-center justify-content-center gap-1 opacity-75">
                                <IconPlus size={14} stroke={2.5} /> Añadir nota
                            </span>
                        </div>
                    </Tooltip>

                    {notebookNotes.length > 0 && (
                        <div className="input-icon position-relative">
                            <span className="input-icon-addon">
                                <IconSearch size={14} />
                            </span>
                            <input type="text" className="form-control form-control-sm bg-light bg-opacity-50 border-secondary-subtle pe-5" placeholder="Buscar en esta libreta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={isThisDeleting || isBeingDragged} />
                            {isSearching && (
                                <span className="position-absolute top-50 end-0 translate-middle-y me-2 cursor-pointer text-muted d-flex align-items-center justify-content-center" onClick={() => setSearchTerm("")} title="Limpiar búsqueda" style={{ zIndex: 10, width: "24px", height: "24px" }}>
                                    <IconX size={14} className="hover-text-danger transition-base" />
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="notes-container flex-grow-1 overflow-hidden d-flex flex-column" style={{ position: "relative", zIndex: 15, minHeight: 0 }}>
                    {visibleNotes.length > 0 ? (
                        <div className="d-flex flex-column overflow-y-auto hide-scrollbar pe-1 h-100">
                            {isSearching && <span className="small text-primary fw-semibold mb-2">Resultados encontrados: {filteredNotes.length}</span>}

                            {visibleNotes.map((note, index) => (
                                <NoteListItem
                                    key={note.id}
                                    note={note}
                                    isFirst={index === 0}
                                    isLast={index === visibleNotes.length - 1}
                                    disabled={isThisDeleting || isBeingDragged}
                                    // 🚀 COMPOSICIÓN: Ahora enviamos todo el objeto editado de vuelta al hook de la página
                                    onEdit={async (updatedNote) => {
                                        if (onEditNote) {
                                            return await onEditNote(notebook.id, updatedNote);
                                        }

                                        return true;
                                    }}
                                    onDelete={async (noteToDelete) => {
                                        if (onDeleteNote) {
                                            return await onDeleteNote(notebook.id, noteToDelete.id);
                                        }

                                        return true;
                                    }}
                                    onMoveUp={(n) => onReorderNote && onReorderNote(notebook.id, n, "up")}
                                    onMoveDown={(n) => onReorderNote && onReorderNote(notebook.id, n, "down")}
                                />
                            ))}

                            {hasMoreNotes && !isSearching && (
                                <button className="btn btn-sm btn-ghost-secondary w-100 mt-2 d-flex justify-content-center align-items-center gap-1 border-dashed flex-shrink-0" onClick={() => setIsExpanded(!isExpanded)} disabled={isThisDeleting || isBeingDragged}>
                                    {!isExpanded ? (
                                        <>
                                            Ver {filteredNotes.length - maxLimit} notas más <IconChevronDown size={14} />
                                        </>
                                    ) : (
                                        <>
                                            Ocultar notas <IconChevronUp size={14} />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="p-3 text-center text-muted border rounded border-dashed bg-light bg-opacity-50 h-100 d-flex flex-column align-items-center justify-content-center">
                            <p className="small fst-italic mb-0">{isSearching ? "No se encontraron coincidencias." : "Sin notas registradas."}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
