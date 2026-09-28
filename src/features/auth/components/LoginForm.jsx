import { useState } from "react";
import { Link } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useLoginForm } from "../hooks/useLoginForm";
import { Button } from "@/shared/components/Button";

export const LoginForm = () => {
    // El componente solo consume el Hook, ignorando Axios o TanStack Query directamente
    const { formData, handleChange, handleSubmit, isLoading, errors } = useLoginForm();

    // Estado visual local para controlar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <form className="card card-md shadow-sm border-0" onSubmit={handleSubmit}>
            <div className="card-body py-5">
                <h2 className="h3 text-center mb-4">Iniciar sesión en tu cuenta</h2>

                {/* Manejo de errores globales devueltos por Laravel (ej. credenciales inválidas) */}
                {errors.general && (
                    <div className="alert alert-danger" role="alert">
                        {errors.general}
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>

                    <input type="email" name="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="tu@empresa.com" value={formData.email} onChange={handleChange} disabled={isLoading} />

                    {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                </div>

                <div className="mb-4">
                    <label className="form-label">
                        Contraseña
                        {/*
                            Implementación del enlace de recuperación.
                            Usamos form-label-description para alinearlo a la derecha del label en Tabler.
                        */}
                        <span className="form-label-description">
                            <Link to="/forgot-password" className="text-primary text-decoration-none">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </span>
                    </label>

                    {/* Contenedor de tipo Input Group de Bootstrap/Tabler para alinear el botón de visibilidad */}
                    <div className="input-group input-group-flat">
                        <input type={showPassword ? "text" : "password"} name="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} placeholder="Tu contraseña" value={formData.password} onChange={handleChange} disabled={isLoading} />

                        <button type="button" className="btn btn-link text-secondary px-3 border" onClick={togglePasswordVisibility} tabIndex="-1" title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                        </button>
                    </div>

                    {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                </div>

                <div className="form-footer">
                    <Button type="submit" variant="primary" fullWidth loading={isLoading} disabled={isLoading}>
                        Iniciar sesión
                    </Button>
                </div>
            </div>
        </form>
    );
};
