import Swal from "sweetalert2";

// ----------------------------------------------------------------------
// 1. CONFIGURACIONES BASE (Invisibles para el resto de la aplicación)
// ----------------------------------------------------------------------

// Base para Modales Centrales (Alertas estáticas, Confirmaciones)
const modalBase = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-primary mx-2",
        cancelButton: "btn btn-ghost-secondary mx-2",
        denyButton: "btn btn-danger mx-2",
        popup: "card shadow-lg border-0 rounded-3",
    },
    buttonsStyling: false,
});

// Base para Toasts (Notificaciones dinámicas, temporales y no bloqueantes)
const toastBase = Swal.mixin({
    toast: true,
    position: "top-end", // Esquina superior derecha, estándar en OS modernos
    showConfirmButton: false,
    timer: 3000, // 3 segundos de duración
    timerProgressBar: true,
    customClass: {
        popup: "shadow-sm border rounded-2",
    },
    didOpen: (toast) => {
        // Pausar el temporizador si el usuario pone el mouse encima
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

// ----------------------------------------------------------------------
// 2. API PÚBLICA DE BRUNOS (Lo único que exportamos)
// ----------------------------------------------------------------------

export const alerts = {
    // --- DIÁLOGOS DE CONFIRMACIÓN (Interrumpen el flujo) ---

    confirmDelete: async (title = "¿Eliminar registro?", text = "Esta acción es irreversible.") => {
        const result = await modalBase.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: "btn btn-danger mx-2", // Forzamos botón rojo
                cancelButton: "btn btn-ghost-secondary mx-2",
            },
            reverseButtons: true,
        });
        return result.isConfirmed;
    },

    confirmAction: async (title = "¿Estás seguro?", text = "", confirmText = "Aceptar") => {
        const result = await modalBase.fire({
            title: title,
            text: text,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: "Cancelar",
            reverseButtons: true,
        });
        return result.isConfirmed;
    },

    // --- TOASTS (Feedback temporal y no bloqueante) ---

    success: (title, text = "") => {
        toastBase.fire({
            icon: "success",
            title: title,
            text: text,
        });
    },

    error: (title = "Ocurrió un error", text = "No se pudo procesar la solicitud.") => {
        toastBase.fire({
            icon: "error",
            title: title,
            text: text,
            timer: 5000, // Los errores merecen más tiempo de lectura
        });
    },

    warning: (title, text = "") => {
        toastBase.fire({
            icon: "warning",
            title: title,
            text: text,
        });
    },

    info: (title, text = "") => {
        toastBase.fire({
            icon: "info",
            title: title,
            text: text,
        });
    },

    // --- ALERTAS BLOQUEANTES (Cuando el error es crítico) ---

    criticalError: (title, text = "") => {
        modalBase.fire({
            icon: "error",
            title: title,
            text: text,
            confirmButtonText: "Entendido",
        });
    },
};
