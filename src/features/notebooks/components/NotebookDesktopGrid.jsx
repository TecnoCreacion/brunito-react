import { useState, useEffect, useCallback } from "react";
import { NotebookCard } from "./NotebookCard";

const SIZES = ["sm", "md", "lg", "xl"];
const DRAG_THRESHOLD = 150;

export const NotebookDesktopGrid = (props) => {
    const { notebooks = [], onUpdateSize } = props;

    // 🚀 ESTADO EXCLUSIVO DE ESCRITORIO: El móvil no necesita saber sobre drag & drop
    const [dragState, setDragState] = useState({
        isDragging: false,
        notebookId: null,
        startX: 0,
        startSizeIndex: 0,
        currentSizeIndex: 0,
        direction: null,
    });

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

    const getOppositeSizeClass = (leftSize) => {
        switch (leftSize) {
            case "sm":
                return "col-12 col-md-8 col-lg-9";
            case "md":
            default:
                return "col-12 col-md-6 col-lg-8";
        }
    };

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

            // Buscamos la libreta activa para determinar límites
            const activeNotebook = notebooks.find((n) => n.id === dragState.notebookId);
            // ⚠️ ADVERTENCIA ARQUITECTÓNICA: is_pinned debe ser mapeado a isPinned mediante un Adapter
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

    // Separar libretas
    const pinnedNotebook = notebooks.find((n) => n.is_pinned);
    const unpinnedNotebooks = notebooks.filter((n) => !n.is_pinned);

    // 🚀 LÓGICA DE COMPOSICIÓN: Inyectamos props de drag a la tarjeta reutilizable
    const renderDraggableCard = (notebook) => {
        const isBeingDragged = dragState.isDragging && dragState.notebookId === notebook.id;
        const activeSizeIndex = isBeingDragged ? dragState.currentSizeIndex : SIZES.indexOf(notebook.size || "md");
        const activeSize = SIZES[activeSizeIndex];

        const cardProps = {
            ...props,
            notebook,
            isBeingDragged,
            dragDirection: dragState.direction,
            onDragStart: handleDragStart,
        };

        if (notebook.is_pinned) {
            return <NotebookCard {...cardProps} />;
        }

        return (
            <div key={notebook.id} className={`${getSizeClass(activeSize)} transition-base`} style={{ transition: isBeingDragged ? "none" : "width 0.3s ease" }}>
                <NotebookCard {...cardProps} />
            </div>
        );
    };

    // Renderizado del Layout de Escritorio
    if (pinnedNotebook) {
        const isDraggingPinned = dragState.isDragging && dragState.notebookId === pinnedNotebook.id;
        const activePinnedSizeIndex = isDraggingPinned ? dragState.currentSizeIndex : SIZES.indexOf(pinnedNotebook.size || "md");
        const activePinnedSize = SIZES[activePinnedSizeIndex];

        return (
            <div className="row g-4 align-items-stretch">
                <div className={`${getSizeClass(activePinnedSize)} transition-base`} style={{ transition: isDraggingPinned ? "none" : "width 0.3s ease" }}>
                    {renderDraggableCard(pinnedNotebook)}
                </div>
                <div className={`${getOppositeSizeClass(activePinnedSize)} transition-base`} style={{ transition: isDraggingPinned ? "none" : "width 0.3s ease" }}>
                    <div className="row g-4 align-items-stretch h-100 align-content-start">{unpinnedNotebooks.map(renderDraggableCard)}</div>
                </div>
            </div>
        );
    }

    return <div className="row g-4 align-items-stretch">{unpinnedNotebooks.map(renderDraggableCard)}</div>;
};
