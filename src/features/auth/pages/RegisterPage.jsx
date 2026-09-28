import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { Button } from "@/shared/components/Button";

import logoBrunOS from "@/assets/images/brand/brand-small-no-bg.png";

export const RegisterPage = () => {
    // Asignación manual del título para la vista de autenticación
    useDocumentTitle("Crear una nueva cuenta");

    const { formData, handleChange, handleSubmit, isPending, errors } = useRegisterForm();

    return (
        <div className="page page-center">
            <div className="container-tight py-4">
                {/* Cabecera y Branding */}
                <div className="text-center mb-3">
                    <Link to="/" className="navbar-brand navbar-brand-autodark">
                        <img
                            src={logoBrunOS}
                            alt="Logo oficial de BrunOS"
                            height="50" // Altura estándar en Tabler para logos de navbar
                            className="navbar-brand-image"
                        />
                    </Link>
                </div>

                <form className="card card-md shadow-sm border-0" onSubmit={handleSubmit}>
                    <div className="card-body py-5">
                        <h2 className="h3 text-center mb-4">Crear una cuenta nueva</h2>

                        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

                        <div className="mb-3">
                            <label className="form-label">Nombre completo</label>
                            <input type="text" name="name" className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder="Ej: Juan Pérez" value={formData.name} onChange={handleChange} disabled={isPending} />
                            {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input type="email" name="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="tu@empresa.com" value={formData.email} onChange={handleChange} disabled={isPending} />
                            {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input type="password" name="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} placeholder="Mínimo 8 caracteres" value={formData.password} onChange={handleChange} disabled={isPending} />
                            {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Confirmar Contraseña</label>
                            <input type="password" name="password_confirmation" className="form-control" placeholder="Repite tu contraseña" value={formData.password_confirmation} onChange={handleChange} disabled={isPending} />
                        </div>

                        <div className="form-footer">
                            <Button type="submit" variant="primary" fullWidth loading={isPending}>
                                Registrarse
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="text-center text-muted mt-4">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-primary font-weight-medium">
                        Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};
