import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { LoginForm } from "../components/LoginForm";

// 1. Importamos el logo desde la infraestructura global de assets
// Ajusta la extensión (.svg, .png, etc.) según el archivo exacto que tengas en tu carpeta
import logoBrunOS from "@/assets/images/brand/brand-small-no-bg.png";

export const LoginPage = () => {
    // Asignación manual del título para la vista de autenticación
    useDocumentTitle("Iniciar Sesión");

    return (
        <div className="page page-center">
            <div className="container container-tight py-4">
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

                {/* Componente que encapsula el flujo de negocio y la UI del formulario */}
                <LoginForm />

                {/* Enlace al registro para nuevos usuarios */}
                <div className="text-center text-muted mt-4">
                    ¿Aún no tienes una cuenta?{" "}
                    <Link to="/register" className="text-primary font-weight-medium text-decoration-none">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};
