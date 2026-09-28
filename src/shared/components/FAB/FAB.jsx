import { IconPlus } from "@tabler/icons-react";

export const FAB = ({ onClick, icon: Icon = IconPlus, color = "primary", ariaLabel = "Agregar" }) => {
    return (
        <button
            className={`btn btn-${color} rounded-circle shadow-lg d-flex align-items-center justify-content-center position-fixed`}
            style={{
                width: "56px",
                height: "56px",
                bottom: "24px",
                right: "24px",
                zIndex: 1050, // Se asegura de flotar por encima del calendario y modales base
                transition: "transform 0.2s ease-in-out",
            }}
            onClick={onClick}
            aria-label={ariaLabel}
            // Pequeño efecto visual al presionar en móviles
            onPointerDown={(e) => (e.currentTarget.style.transform = "scale(0.90)")}
            onPointerUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onPointerLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            <Icon size={28} stroke={2.5} className="text-white" />
        </button>
    );
};
