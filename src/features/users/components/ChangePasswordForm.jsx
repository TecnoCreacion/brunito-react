import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "@/shared/components/Button";

const INITIAL_PASSWORD_STATE = {
    currentPassword: "",
    password: "",
    passwordConfirmation: "",
};

const INITIAL_VISIBILITY_STATE = {
    currentPassword: false,
    password: false,
    passwordConfirmation: false,
};

export const ChangePasswordForm = ({ onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState(INITIAL_PASSWORD_STATE);
    const [showPasswords, setShowPasswords] = useState(INITIAL_VISIBILITY_STATE);
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const toggleVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Mapeo de nombres camelCase del estado a snake_case de errores de Laravel
        const errorKeyMap = {
            currentPassword: "current_password",
            password: "password",
            passwordConfirmation: "password_confirmation",
        };
        const apiErrorKey = errorKeyMap[name] || name;

        if (fieldErrors[apiErrorKey]) {
            setFieldErrors((prev) => ({ ...prev, [apiErrorKey]: null }));
        }
        if (generalError) setGeneralError("");
        if (successMessage) setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setGeneralError("");
        setSuccessMessage("");

        if (formData.password !== formData.passwordConfirmation) {
            setFieldErrors({
                password_confirmation: ["La confirmación no coincide con la nueva contraseña."],
            });
            return;
        }

        try {
            await onSubmit(formData);
            setFormData(INITIAL_PASSWORD_STATE);
            setShowPasswords(INITIAL_VISIBILITY_STATE);
            setSuccessMessage("Contraseña actualizada correctamente.");
        } catch (error) {
            // Soporta tanto el error crudo de Axios como un error normalizado por interceptor
            const responseData = error?.response?.data || error?.data || error;
            const status = error?.response?.status || error?.status;
            const apiErrors = responseData?.errors;

            const hasFieldErrors = apiErrors && typeof apiErrors === "object" && Object.keys(apiErrors).some((key) => key !== "error" && Array.isArray(apiErrors[key]) && apiErrors[key].length > 0);

            if ((status === 422 || hasFieldErrors) && hasFieldErrors) {
                setFieldErrors(apiErrors);
            } else if (responseData?.message) {
                setGeneralError(responseData.message);
            } else {
                setGeneralError("Ocurrió un error inesperado al actualizar la contraseña.");
            }
        }
    };

    const isFormIncomplete = !formData.currentPassword || !formData.password || !formData.passwordConfirmation;

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Seguridad y Contraseña</h3>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="card-body">
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}

                    {generalError && (
                        <div className="alert alert-danger" role="alert">
                            {generalError}
                        </div>
                    )}

                    {/* Contraseña actual */}
                    <div className="mb-3">
                        <label htmlFor="current-password" className="form-label required">
                            Contraseña actual
                        </label>
                        <div className="input-group has-validation">
                            <input id="current-password" type={showPasswords.currentPassword ? "text" : "password"} name="currentPassword" autoComplete="current-password" className={`form-control ${fieldErrors.current_password ? "is-invalid" : ""}`} value={formData.currentPassword} onChange={handleChange} disabled={isSubmitting} required />
                            <button type="button" className="btn btn-outline-secondary" onClick={() => toggleVisibility("currentPassword")} disabled={isSubmitting} aria-label={showPasswords.currentPassword ? "Ocultar contraseña actual" : "Mostrar contraseña actual"} title={showPasswords.currentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                                {showPasswords.currentPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                            </button>
                            {fieldErrors.current_password && <div className="invalid-feedback">{fieldErrors.current_password[0]}</div>}
                        </div>
                    </div>

                    {/* Nueva contraseña */}
                    <div className="mb-3">
                        <label htmlFor="new-password" className="form-label required">
                            Nueva contraseña
                        </label>
                        <div className="input-group has-validation">
                            <input id="new-password" type={showPasswords.password ? "text" : "password"} name="password" autoComplete="new-password" className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`} value={formData.password} onChange={handleChange} disabled={isSubmitting} required />
                            <button type="button" className="btn btn-outline-secondary" onClick={() => toggleVisibility("password")} disabled={isSubmitting} aria-label={showPasswords.password ? "Ocultar nueva contraseña" : "Mostrar nueva contraseña"} title={showPasswords.password ? "Ocultar contraseña" : "Mostrar contraseña"}>
                                {showPasswords.password ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                            </button>
                            {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password[0]}</div>}
                        </div>
                        <small className="form-hint">Mínimo 8 caracteres, incluyendo letras y números. No puedes reutilizar contraseñas anteriores.</small>
                    </div>

                    {/* Confirmar nueva contraseña */}
                    <div className="mb-3">
                        <label htmlFor="confirm-password" className="form-label required">
                            Confirmar nueva contraseña
                        </label>
                        <div className="input-group has-validation">
                            <input id="confirm-password" type={showPasswords.passwordConfirmation ? "text" : "password"} name="passwordConfirmation" autoComplete="new-password" className={`form-control ${fieldErrors.password_confirmation ? "is-invalid" : ""}`} value={formData.passwordConfirmation} onChange={handleChange} disabled={isSubmitting} required />
                            <button type="button" className="btn btn-outline-secondary" onClick={() => toggleVisibility("passwordConfirmation")} disabled={isSubmitting} aria-label={showPasswords.passwordConfirmation ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"} title={showPasswords.passwordConfirmation ? "Ocultar contraseña" : "Mostrar contraseña"}>
                                {showPasswords.passwordConfirmation ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                            </button>
                            {fieldErrors.password_confirmation && <div className="invalid-feedback">{fieldErrors.password_confirmation[0]}</div>}
                        </div>
                    </div>
                </div>

                <div className="card-footer text-end">
                    <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting || isFormIncomplete}>
                        {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
