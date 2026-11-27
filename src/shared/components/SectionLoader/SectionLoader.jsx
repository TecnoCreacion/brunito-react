export const SectionLoader = ({ message = "Cargando información...", submessage = "", size = "md", variant = "primary", centered = true, minHeight = "200px", className = "" }) => {
    const sizeClasses = {
        sm: "spinner-border-sm",
        md: "",
        lg: "spinner-border-lg",
    };

    const containerClasses = ["d-flex flex-column align-items-center justify-content-center text-muted", centered ? "w-100 py-5" : "py-3", className].filter(Boolean).join(" ");

    return (
        <div className={containerClasses} style={{ minHeight: centered ? minHeight : undefined }} role="status" aria-live="polite">
            <div className={`spinner-border text-${variant} ${sizeClasses[size] || ""} mb-3`.trim()} aria-hidden="true" />
            {message && <p className="mb-1 fw-medium text-body">{message}</p>}
            {submessage && <small className="text-muted text-center">{submessage}</small>}
        </div>
    );
};
