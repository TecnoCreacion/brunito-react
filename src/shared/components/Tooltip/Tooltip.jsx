import { useState } from "react";
import { useFloating, autoUpdate, offset, flip, shift, useHover, useFocus, useDismiss, useRole, useInteractions, FloatingPortal } from "@floating-ui/react";

export const Tooltip = ({ children, content, placement = "top" }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement,
        whileElementsMounted: autoUpdate,
        middleware: [offset(8), flip({ fallbackAxisSideDirection: "start" }), shift({ padding: 5 })],
    });

    const { setReference, setFloating } = refs;

    // El delay de 150ms actúa como un "Long Press" natural en móviles
    const hover = useHover(context, { move: false, delay: { open: 150, close: 50 } });
    const focus = useFocus(context);

    // Configuración para que el usuario pueda cerrar el tooltip tocando fuera de él en móviles
    const dismiss = useDismiss(context, { outsidePressEvent: "pointerdown" });
    const role = useRole(context, { role: "tooltip" });

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

    return (
        <>
            <div
                ref={setReference}
                {...getReferenceProps()}
                className="d-flex w-100"
                style={{
                    // Solución Móvil: Evita que el navegador seleccione el texto o abra su propio menú al mantener presionado
                    WebkitTouchCallout: "none",
                    userSelect: "none",
                }}
                // Evita explícitamente el clic derecho / menú contextual en este elemento
                onContextMenu={(e) => e.preventDefault()}
            >
                {children}
            </div>

            {isOpen && (
                <FloatingPortal>
                    <div ref={setFloating} style={{ ...floatingStyles, zIndex: 1060 }} {...getFloatingProps()}>
                        <div className="bg-dark text-white rounded shadow-sm px-2 py-1" style={{ fontSize: "0.80rem", maxWidth: "250px" }}>
                            {content}
                        </div>
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};
