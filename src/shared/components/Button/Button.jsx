export const Button = ({
    ref,
    children,
    variant = "primary", // primario por defecto
    size,
    loading = false,
    disabled = false,
    icon,
    fullWidth = false,
    className = "",
    type = "button",
    ...props
}) => {
    // Clases base de Tabler/Bootstrap 5
    const baseClass = "btn";
    const variantClass = variant ? `btn-${variant}` : "";
    const sizeClass = size ? `btn-${size}` : "";
    const widthClass = fullWidth ? "w-100" : "";

    // Tabler maneja el estado de carga inyectando un spinner con la clase btn-loading
    const loadingClass = loading ? "btn-loading" : "";

    // Combinación limpia de clases
    const combinedClasses = [baseClass, variantClass, sizeClass, widthClass, loadingClass, className].filter(Boolean).join(" ");

    return (
        <button ref={ref} type={type} className={combinedClasses} disabled={disabled || loading} {...props}>
            {/* Si hay un ícono y no está cargando, lo renderizamos con un margen */}
            {icon && !loading && <span className="me-2">{icon}</span>}

            {/* El contenido del botón */}
            {children}
        </button>
    );
};
