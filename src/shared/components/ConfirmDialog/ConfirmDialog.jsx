import { useEffect, useRef } from "react";
import Swal from "sweetalert2";

const VARIANT_CONFIG = {
    danger: {
        icon: "warning",
        confirmBtnClass: "btn btn-danger",
    },
    warning: {
        icon: "warning",
        confirmBtnClass: "btn btn-warning",
    },
    primary: {
        icon: "question",
        confirmBtnClass: "btn btn-primary",
    },
    success: {
        icon: "success",
        confirmBtnClass: "btn btn-success",
    },
    info: {
        icon: "info",
        confirmBtnClass: "btn btn-info",
    },
};

/**
 * 🚀 DESIGN SYSTEM (CAPA SHARED): DIÁLOGO CORPORATIVO DE CONFIRMACIÓN
 * Encapsula SweetAlert2 con la estética de Tabler UI / Bootstrap 5 para evitar
 * acoplamiento directo a librerías externas en las Features.
 */
export const ConfirmDialog = ({
    isOpen = false,
    title = "¿Confirmar acción?",
    message = "Esta operación no se puede deshacer.",
    variant = "danger",
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    loading = false,
    onConfirm,
    onCancel,
}) => {
    const onConfirmRef = useRef(onConfirm);
    const onCancelRef = useRef(onCancel);

    // Mantiene referencias frescas sin disparar reaperturas del modal
    useEffect(() => {
        onConfirmRef.current = onConfirm;
        onCancelRef.current = onCancel;
    }, [onConfirm, onCancel]);

    // 1. Controla la apertura y cierre de SweetAlert2
    useEffect(() => {
        if (!isOpen) {
            if (Swal.isVisible()) {
                Swal.close();
            }
            return;
        }

        const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.danger;

        Swal.fire({
            title,
            text: message,
            icon: config.icon,
            showCancelButton: true,
            confirmButtonText: confirmLabel,
            cancelButtonText: cancelLabel,
            reverseButtons: true,
            focusCancel: variant === "danger",
            buttonsStyling: false,
            allowOutsideClick: () => !Swal.isLoading(),
            allowEscapeKey: () => !Swal.isLoading(),
            customClass: {
                popup: "card shadow-lg border-0 rounded-3",
                title: "h3 fw-bold text-body pt-2",
                htmlContainer: "text-secondary",
                actions: "gap-2 mt-3",
                confirmButton: config.confirmBtnClass,
                cancelButton: "btn btn-link link-secondary",
            },
            preConfirm: () => {
                if (onConfirmRef.current) {
                    onConfirmRef.current();
                }
                // Retornamos false para mantener el diálogo abierto mientras loading=true
                return false;
            },
        }).then((result) => {
            if (result.dismiss && onCancelRef.current) {
                onCancelRef.current();
            }
        });
    }, [isOpen, title, message, variant, confirmLabel, cancelLabel]);

    // 2. Sincroniza el spinner de carga cuando la mutación está en curso
    useEffect(() => {
        if (!isOpen || !Swal.isVisible()) return;

        if (loading) {
            Swal.showLoading();
        } else {
            Swal.hideLoading();
        }
    }, [isOpen, loading]);

    // 3. Limpieza garantizada al desmontar el componente padre
    useEffect(() => {
        return () => {
            if (Swal.isVisible()) {
                Swal.close();
            }
        };
    }, []);

    return null;
};
