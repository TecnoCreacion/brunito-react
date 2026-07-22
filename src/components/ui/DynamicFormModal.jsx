import { useState, useEffect } from "react";

export const DynamicFormModal = ({ show, onClose, title, schema, initialData, onSubmit, isPending }) => {
    const isEditing = !!initialData;
    const [formData, setFormData] = useState({});

    // Inicializamos el formulario cuando se abre el modal
    useEffect(() => {
        if (show) {
            const initial = {};
            schema.forEach((field) => {
                // Si estamos editando, cargamos el dato. Si no, usamos el valor por defecto del esquema o vacío
                initial[field.name] = initialData?.[field.name] || field.defaultValue || "";
            });
            setFormData(initial);
        }
    }, [show, initialData, schema]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!show) return null;

    return (
        <div className="modal modal-blur fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={isPending}></button>
                    </div>

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="modal-body">
                            <div className="row g-3">
                                {schema.map((field) => {
                                    // Lógica para campos que solo aparecen al crear o editar
                                    if (field.showOnlyOnCreate && isEditing) return null;
                                    if (field.showOnlyOnEdit && !isEditing) return null;

                                    return (
                                        <div key={field.name} className={`col-12 ${field.colSpan || "col-md-6"}`}>
                                            <label className="form-label">
                                                {field.label}
                                                {field.required && <span className="text-danger ms-1">*</span>}
                                                {field.type === "password" && isEditing && <span className="text-muted ms-1 small fw-normal">(Opcional si no la cambias)</span>}
                                            </label>

                                            {field.type === "select" ? (
                                                <select className="form-select" value={formData[field.name]} onChange={(e) => handleChange(field.name, e.target.value)} required={field.required} disabled={isPending}>
                                                    <option value="">Selecciona una opción...</option>
                                                    {field.options?.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type || "text"}
                                                    className="form-control"
                                                    placeholder={field.placeholder || ""}
                                                    value={formData[field.name]}
                                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                                    // La contraseña es requerida solo si estamos creando
                                                    required={field.type === "password" ? !isEditing : field.required}
                                                    disabled={isPending}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-link link-secondary" onClick={onClose} disabled={isPending}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary ms-auto" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span> Guardando...
                                    </>
                                ) : (
                                    <>Guardar Cambios</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
