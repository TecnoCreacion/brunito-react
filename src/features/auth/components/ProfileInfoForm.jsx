import { useEffect, useState } from "react";
import { Button } from "@/shared/components/Button";

export const ProfileInfoForm = ({ initialData, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                email: initialData.email || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: null }));
        }
        if (successMessage) setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setSuccessMessage("");

        try {
            await onSubmit(formData);
            setSuccessMessage("Datos del perfil actualizados correctamente.");
        } catch (error) {
            if (error?.response?.status === 422 && error.response.data?.errors) {
                setFieldErrors(error.response.data.errors);
            }
        }
    };

    const isUnchanged = initialData && formData.name.trim() === (initialData.name || "").trim() && formData.email.trim() === (initialData.email || "").trim();

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h3 className="card-title">Información Personal</h3>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="card-body">
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="profile-name" className="form-label required">
                            Nombre completo
                        </label>
                        <input id="profile-name" type="text" name="name" className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`} value={formData.name} onChange={handleChange} disabled={isSubmitting} required />
                        {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name[0]}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="profile-email" className="form-label required">
                            Correo electrónico principal
                        </label>
                        <input id="profile-email" type="email" name="email" className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`} value={formData.email} onChange={handleChange} disabled={isSubmitting} required />
                        <small className="form-hint">Si modificas tu correo, el anterior quedará guardado en tu historial como inactivo.</small>
                        {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email[0]}</div>}
                    </div>
                </div>

                <div className="card-footer text-end">
                    <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting || isUnchanged}>
                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
