import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconEye, IconPencil, IconArrowsSort, IconTrash } from "@tabler/icons-react";

/**
 * 🚀 CAPA 2: COMPONENTE PRESENTACIONAL (Dropdown Contextual)
 * Renderiza mediante Portal en document.body para evitar recortes por overflow/z-index
 * dentro de las celdas de react-big-calendar o contenedores con scroll.
 */
export const EventActionDropdown = ({ event, isOpen, anchorRef, onClose, onSummary, onEdit, onOrder, onDelete }) => {
    const menuRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0, ready: false });

    // Calcula coordenadas exactas respecto al elemento disparador (botón 3 puntos o tarjeta)
    useEffect(() => {
        if (!isOpen) {
            setPosition((prev) => ({ ...prev, ready: false }));
            return;
        }

        const updatePosition = () => {
            const anchorEl = anchorRef?.current;
            if (!anchorEl) return;

            const rect = anchorEl.getBoundingClientRect();
            const menuWidth = 175;
            const menuEstimatedHeight = 168;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Alineación horizontal: intenta alinear a la derecha del disparador sin salirse de pantalla
            let left = rect.right - menuWidth;
            if (left < 8) {
                left = Math.min(rect.left, viewportWidth - menuWidth - 8);
            }

            // Alineación vertical: si no cabe abajo, se despliega automáticamente hacia arriba
            const spaceBelow = viewportHeight - rect.bottom;
            const top = spaceBelow < menuEstimatedHeight && rect.top > menuEstimatedHeight ? rect.top - menuEstimatedHeight - 4 : rect.bottom + 4;

            setPosition({ top, left, ready: true });
        };

        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isOpen, anchorRef]);

    // Cierre al hacer clic fuera o presionar Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (e) => {
            const isInsideMenu = menuRef.current && menuRef.current.contains(e.target);
            const isInsideAnchor = anchorRef?.current && anchorRef.current.contains(e.target);
            if (!isInsideMenu && !isInsideAnchor) {
                onClose();
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen || !event) return null;

    const handleAction = (e, callback, payload) => {
        e.stopPropagation();
        onClose();
        if (callback) callback(payload);
    };

    return createPortal(
        <div
            ref={menuRef}
            className="dropdown-menu show shadow-lg border"
            style={{
                position: "fixed",
                top: `${position.top}px`,
                left: `${position.left}px`,
                minWidth: "175px",
                zIndex: 1080,
                visibility: position.ready ? "visible" : "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <button type="button" className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={(e) => handleAction(e, onSummary, event)}>
                <IconEye size={16} className="text-info" />
                <span>Resumen</span>
            </button>

            <button type="button" className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={(e) => handleAction(e, onEdit, event.id)}>
                <IconPencil size={16} className="text-primary" />
                <span>Editar</span>
            </button>

            <button type="button" className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={(e) => handleAction(e, onOrder, event)}>
                <IconArrowsSort size={16} className="text-warning" />
                <span>Ordenar</span>
            </button>

            <div className="dropdown-divider my-1" />

            <button type="button" className="dropdown-item text-danger d-flex align-items-center gap-2 py-2" onClick={(e) => handleAction(e, onDelete, event.id)}>
                <IconTrash size={16} />
                <span>Eliminar</span>
            </button>
        </div>,
        document.body,
    );
};
