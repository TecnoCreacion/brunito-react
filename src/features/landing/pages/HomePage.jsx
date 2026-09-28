import { Link } from "react-router-dom";
// Importamos los componentes universales de nuestro Design System
import { Button } from "@/shared/components/Button";

export const HomePage = () => {
    return (
        <div className="page page-center">
            <div className="container-tight py-4">
                {/* Cabecera y Branding */}
                <div className="text-center mb-4">
                    <h1 className="text-primary font-weight-bold display-4">BrunOS</h1>
                    <p className="text-muted lead mt-3">Tu ecosistema empresarial modular.</p>
                </div>

                {/* Tarjeta Principal de Información */}
                <div className="card card-md shadow-sm border-0">
                    <div className="card-body text-center py-5">
                        <h2 className="h3 mb-3">El futuro de tu gestión</h2>

                        <p className="text-muted mb-4 px-md-3">BrunOS es una plataforma empresarial modular cuyo objetivo es convertirse en un ERP/CRM completo. Inicialmente será tu centro para Agenda, Recordatorios y Notas. Posteriormente crecerá hacia un ecosistema robusto integrando Clientes, Empresas, Facturación e Inventario.</p>

                        {/* Acciones de Navegación */}
                        <div className="d-flex flex-column gap-3 mt-5">
                            <Link to="/register" className="text-decoration-none">
                                <Button variant="primary" className="w-100 py-2">
                                    Crear una cuenta gratis
                                </Button>
                            </Link>

                            <div className="text-muted mt-2">
                                ¿Ya tienes una cuenta?{" "}
                                <Link to="/login" className="text-primary font-weight-medium">
                                    Inicia sesión aquí
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer simple para la Landing */}
                <div className="text-center text-muted mt-4 small">
                    <p>Potenciado por la base tecnológica de Brunito React</p>
                </div>
            </div>
        </div>
    );
};
