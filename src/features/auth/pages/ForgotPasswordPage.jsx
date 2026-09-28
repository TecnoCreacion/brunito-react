import { Link } from "react-router-dom";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";
import { Button } from "@/shared/components/Button";

export const ForgotPasswordPage = () => {
    const { email, handleChange, handleSubmit, isPending, errors, status } = useForgotPasswordForm();

    return (
        <div className="page page-center">
            <div className="container-tight py-4">
                <div className="text-center mb-4">
                    <h1 className="text-primary font-weight-bold display-4">BrunOS</h1>
                </div>

                <form className="card card-md shadow-sm border-0" onSubmit={handleSubmit}>
                    <div className="card-body py-5">
                        <h2 className="h3 text-center mb-4">Recuperar contraseña</h2>
                        <p className="text-muted mb-4 text-center px-md-3">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>

                        {/* Mensaje de éxito devuelto por Laravel */}
                        {status && (
                            <div className="alert alert-success" role="alert">
                                {status}
                            </div>
                        )}

                        {/* Mensaje de error general */}
                        {errors.general && (
                            <div className="alert alert-danger" role="alert">
                                {errors.general}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                placeholder="tu@empresa.com"
                                value={email}
                                onChange={handleChange}
                                disabled={isPending || status} // Deshabilitamos si está cargando o ya se envió con éxito
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                        </div>

                        <div className="form-footer">
                            <Button type="submit" variant="primary" fullWidth loading={isPending} disabled={!!status}>
                                Enviar enlace de recuperación
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="text-center text-muted mt-4">
                    Olvídalo,{" "}
                    <Link to="/login" className="text-primary font-weight-medium">
                        regresar al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};
