import { useState, useEffect, useCallback } from "react";
import { IconPaperclip, IconTrash, IconEdit, IconPlus, IconPin, IconPinFilled } from "@tabler/icons-react";
import { Tooltip } from "@/shared/components/Tooltip/Tooltip";
import { NoteListItem } from "./NoteListItem";

const SIZES = ["sm", "md", "lg", "xl"];
const DRAG_THRESHOLD = 150;

export const NotebookBoard = ({ notebooks = [], onDelete, onEdit, onUpdateSize, onTogglePin, onEditNote, onReorderNote, onAddNote, deletingId = null }) => {
    const [dragState, setDragState] = useState({
        isDragging: false,
        notebookId: null,
        startX: 0,
        startSizeIndex: 0,
        currentSizeIndex: 0,
        direction: null,
    });

    const getThemeClass = (theme) => {
        switch (theme) {
            case "white-blank":
                return "bg-white text-dark border-light";
            case "yellow-lined":
            default:
                return "bg-warning-subtle text-dark border-warning-subtle";
        }
    };

    const getSizeClass = (size) => {
        switch (size) {
            case "sm":
                return "col-12 col-md-4 col-lg-3";
            case "lg":
                return "col-12 col-md-8 col-lg-6";
            case "xl":
                return "col-12 col-lg-8 col-xl-12";
            case "md":
            default:
                return "col-12 col-md-6 col-lg-4";
        }
    };

    // Helper para calcular la columna complementaria (derecha) en base al tamaño de la izquierda
    const getOppositeSizeClass = (leftSize) => {
        switch (leftSize) {
            case "sm":
                return "col-12 col-md-8 col-lg-9"; // Si la izq es 33%, la der es 66%
            case "md":
            default:
                return "col-12 col-md-6 col-lg-8"; // Si la izq es 50%, la der es 50%
        }
    };

    // --- LÓGICA DE ARRASTRE ---
    const handleDragStart = (e, notebook, direction) => {
        e.preventDefault();
        const startSizeIndex = SIZES.indexOf(notebook.size || "md");
        setDragState({
            isDragging: true,
            notebookId: notebook.id,
            startX: e.clientX,
            startSizeIndex,
            currentSizeIndex: startSizeIndex,
            direction,
        });
    };

    const handleDragMove = useCallback(
        (e) => {
            if (!dragState.isDragging) return;
            const deltaX = e.clientX - dragState.startX;
            let stepChange = Math.round(deltaX / DRAG_THRESHOLD);
            if (dragState.direction === "left") stepChange = -stepChange;

            let newSizeIndex = dragState.startSizeIndex + stepChange;

            // 🚀 REGLA VISUAL: Si está fijada, el tamaño máximo es "md" (índice 1)
            const activeNotebook = notebooks.find((n) => n.id === dragState.notebookId);
            const maxIndex = activeNotebook?.is_pinned ? SIZES.indexOf("md") : SIZES.length - 1;

            newSizeIndex = Math.max(0, Math.min(newSizeIndex, maxIndex));

            if (newSizeIndex !== dragState.currentSizeIndex) {
                setDragState((prev) => ({ ...prev, currentSizeIndex: newSizeIndex }));
            }
        },
        [dragState, notebooks],
    );

    const handleDragEnd = useCallback(() => {
        if (!dragState.isDragging) return;
        const { notebookId, currentSizeIndex, startSizeIndex } = dragState;
        const finalSize = SIZES[currentSizeIndex];

        setDragState({ isDragging: false, notebookId: null, startX: 0, startSizeIndex: 0, currentSizeIndex: 0, direction: null });

        if (startSizeIndex !== currentSizeIndex && onUpdateSize) {
            onUpdateSize(notebookId, { size: finalSize });
        }
    }, [dragState, onUpdateSize]);

    useEffect(() => {
        if (dragState.isDragging) {
            window.addEventListener("mousemove", handleDragMove);
            window.addEventListener("mouseup", handleDragEnd);
            document.body.style.cursor = "ew-resize";
            document.body.style.userSelect = "none";
        }
        return () => {
            window.removeEventListener("mousemove", handleDragMove);
            window.removeEventListener("mouseup", handleDragEnd);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [dragState.isDragging, handleDragMove, handleDragEnd]);

    if (notebooks.length === 0) {
        return (
            <div className="text-center p-5 text-muted">
                <p>No hay libretas creadas en este tablero. ¡Agrega una nueva para comenzar!</p>
            </div>
        );
    }

    // 1. Separar libretas
    const pinnedNotebook = notebooks.find((n) => n.is_pinned); // Ahora solo buscamos UNA (find en lugar de filter)
    const unpinnedNotebooks = notebooks.filter((n) => !n.is_pinned);

    // Regla: Máximo 1 fijada
    const canPinMore = !pinnedNotebook;

    // --- FUNCIÓN DE RENDERIZADO DE TARJETA (DRY) ---
    // Refactorizamos la tarjeta para no duplicar código entre la columna izquierda y derecha
    const renderCard = (notebook) => {
        const isThisDeleting = deletingId === notebook.id;
        const isBeingDragged = dragState.isDragging && dragState.notebookId === notebook.id;
        const isPinned = notebook.is_pinned;

        const activeSizeIndex = isBeingDragged ? dragState.currentSizeIndex : SIZES.indexOf(notebook.size || "md");
        const activeSize = SIZES[activeSizeIndex];
        const notebookNotes = notebook.notes || [];

        // Si está en el flujo general (no fijada), le aplicamos su clase de columna normal.
        // Si está fijada, el layout exterior controlará su ancho, por lo que solo devolvemos el interior.
        const cardContent = (
            <div
                className={`card shadow-sm position-relative p-3 h-100 notebook-card ${getThemeClass(notebook.color_theme)} ${isThisDeleting ? "opacity-50" : ""}`}
                style={{
                    borderRadius: "4px",
                    boxShadow: isPinned ? "0 0 0 2px var(--bs-primary), 0 4px 6px rgba(0,0,0,0.07)" : isBeingDragged ? "0 10px 15px rgba(0,0,0,0.15)" : "0 4px 6px rgba(0,0,0,0.07)",
                    borderTop: isPinned ? "none" : "3px solid rgba(0,0,0,0.1)",
                    zIndex: isBeingDragged ? 100 : isPinned ? 50 : 1,
                }}
            >
                {/* Bordes de redimensionamiento */}
                <div
                    className="position-absolute top-0 end-0 h-100 transition-base"
                    style={{ width: "8px", cursor: "ew-resize", zIndex: 10, backgroundColor: isBeingDragged && dragState.direction === "right" ? "var(--bs-primary)" : "transparent", borderTopRightRadius: "4px", borderBottomRightRadius: "4px" }}
                    onMouseDown={(e) => handleDragStart(e, notebook, "right")}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(13, 110, 253, 0.5)")}
                    onMouseLeave={(e) => {
                        if (!(isBeingDragged && dragState.direction === "right")) e.target.style.backgroundColor = "transparent";
                    }}
                    title={`Arrastrar para ajustar ancho ${isPinned ? "(Máx 50%)" : ""}`}
                />

                <div className="position-absolute top-0 start-50 translate-middle-x px-3" style={{ marginTop: "-12px", color: "#6c757d", cursor: isPinned ? "default" : "grab", zIndex: 5 }} title={isPinned ? "Libreta fijada" : "Arrastrar libreta"}>
                    {isPinned ? <IconPinFilled size={24} className="text-primary" /> : <IconPaperclip size={24} className="transform-rotate-45 text-secondary opacity-75" />}
                </div>

                <div className="card-body d-flex flex-column pt-2 p-0 mt-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="card-title h5 font-weight-bold text-truncate mb-0" style={{ maxWidth: "60%" }}>
                            {notebook.title || "Sin título"}
                        </h3>

                        <div className="d-flex gap-1 position-relative" style={{ zIndex: 15 }}>
                            <Tooltip content={isPinned ? "Desfijar libreta" : canPinMore ? "Fijar a la izquierda (Máx 1)" : "Solo puedes fijar una libreta"} position="top">
                                <button className={`btn btn-sm btn-icon ${isPinned ? "btn-primary" : "btn-ghost-secondary"}`} onClick={() => onTogglePin && onTogglePin(notebook.id, !isPinned)} disabled={isThisDeleting || isBeingDragged || (!isPinned && !canPinMore)}>
                                    {isPinned ? <IconPinFilled size={16} /> : <IconPin size={16} />}
                                </button>
                            </Tooltip>
                            <button className="btn btn-sm btn-icon btn-ghost-secondary" onClick={() => onEdit(notebook)} disabled={isThisDeleting || isBeingDragged} title="Editar libreta">
                                <IconEdit size={16} />
                            </button>
                            <button className="btn btn-sm btn-icon btn-ghost-danger" onClick={() => onDelete(notebook.id)} disabled={isThisDeleting || isBeingDragged} title="Eliminar libreta">
                                {isThisDeleting ? <span className="spinner-border spinner-border-sm text-danger" role="status"></span> : <IconTrash size={16} />}
                            </button>
                        </div>
                    </div>

                    <hr className="my-2 opacity-25" />

                    <Tooltip content={`Lienzo para '${notebook.title}'.`} position="top">
                        <div className="w-100 cursor-pointer p-2 mb-3 rounded transition-base border border-dashed border-secondary-subtle bg-light bg-opacity-50 hover-bg-light text-center" onClick={() => !isBeingDragged && onAddNote && onAddNote(notebook)} style={{ zIndex: 15, position: "relative" }}>
                            <p className="card-text text-muted small mb-1 text-truncate">{notebook.description || "Espacio de notas libre..."}</p>
                            <span className="text-primary small fw-semibold d-flex align-items-center justify-content-center gap-1 opacity-75">
                                <IconPlus size={14} stroke={2.5} /> Añadir nota
                            </span>
                        </div>
                    </Tooltip>

                    <div className="notes-container flex-grow-1" style={{ position: "relative", zIndex: 15 }}>
                        {notebookNotes.length > 0 ? (
                            <div className="d-flex flex-column">
                                {notebookNotes.slice(0, isPinned ? 10 : 5).map((note, index) => (
                                    <NoteListItem key={note.id} note={note} isFirst={index === 0} isLast={index === notebookNotes.length - 1} disabled={isThisDeleting || isBeingDragged} onEdit={(n) => onEditNote && onEditNote(notebook.id, n)} onMoveUp={(n) => onReorderNote && onReorderNote(notebook.id, n, "up")} onMoveDown={(n) => onReorderNote && onReorderNote(notebook.id, n, "down")} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-3 text-center text-muted border rounded border-dashed bg-light bg-opacity-50 h-100 d-flex align-items-center justify-content-center">
                                <p className="small fst-italic mb-0">Sin notas registradas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );

        if (isPinned) return cardContent;

        return (
            <div key={notebook.id} className={`${getSizeClass(activeSize)} transition-base`} style={{ transition: isBeingDragged ? "none" : "width 0.3s ease" }}>
                {cardContent}
            </div>
        );
    };

    // 🚀 RENDERIZADO DEL LAYOUT DIVIDIDO
    if (pinnedNotebook) {
        const isDraggingPinned = dragState.isDragging && dragState.notebookId === pinnedNotebook.id;
        const activePinnedSizeIndex = isDraggingPinned ? dragState.currentSizeIndex : SIZES.indexOf(pinnedNotebook.size || "md");
        const activePinnedSize = SIZES[activePinnedSizeIndex];

        return (
            <div className="row g-4 align-items-stretch">
                {/* Columna Izquierda: Libreta Fijada que se estira al 100% de la altura disponible */}
                <div className={`${getSizeClass(activePinnedSize)} transition-base`} style={{ transition: isDraggingPinned ? "none" : "width 0.3s ease" }}>
                    {renderCard(pinnedNotebook)}
                </div>

                {/* Columna Derecha: Contenedor para el resto de libretas */}
                <div className={`${getOppositeSizeClass(activePinnedSize)} transition-base`} style={{ transition: isDraggingPinned ? "none" : "width 0.3s ease" }}>
                    <div className="row g-4 align-items-stretch h-100 align-content-start">{unpinnedNotebooks.map(renderCard)}</div>
                </div>
            </div>
        );
    }

    // Layout estándar si no hay libreta fijada
    return <div className="row g-4 align-items-stretch">{unpinnedNotebooks.map(renderCard)}</div>;
};
