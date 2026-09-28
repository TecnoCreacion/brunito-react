import { useEffect } from "react";

export const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
    // 🚀 Usamos la clase de Bootstrap para evitar el salto feo de la barra de scroll[cite: 1]
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
        return () => {
            document.body.classList.remove("modal-open");
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Agregamos overflow-y: auto para que el modal mismo pueda scrollear si la pantalla es muy pequeña */}
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                style={{ zIndex: 1055, overflowY: "auto" }}
                onClick={(e) => {
                    // Cierra el modal solo si hacemos clic en el fondo gris, no en el contenido
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <div className={`modal-dialog modal-dialog-centered modal-${size} modal-dialog-scrollable`}>
                    <div className="modal-content border-0 shadow-lg rounded-4 d-flex flex-column h-100">
                        <div className="modal-header border-bottom-0 pb-0 pt-4 px-4 p-md-5 pb-md-0">
                            {title && <h3 className="modal-title fw-bold text-dark">{title}</h3>}
                            <button type="button" className="btn-close shadow-none" onClick={onClose} aria-label="Cerrar modal"></button>
                        </div>

                        {/* El contenido de la Feature */}
                        {children}
                    </div>
                </div>
            </div>

            <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
        </>
    );
};
