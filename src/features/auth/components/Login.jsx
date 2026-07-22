import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
    // Cambiamos 'email' por 'identifier' para abarcar usuario o correo
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log(`Login Correcto`, data);
            navigate("/", { replace: true });
        },
        onError: (error) => {
            if (error.response?.status === 422 || error.response?.status === 401) {
                setErrorMsg("Credenciales incorrectas. Verifica tus datos.");
            } else {
                setErrorMsg("Error de conexión con el servidor.");
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg("");

        // Enviamos 'identifier' a nuestro auth.service.js
        loginMutation.mutate({ Usuario: identifier, Contrasena: password });
    };

    return (
        <div className="row g-0 flex-fill vh-100">
            {/* LADO IZQUIERDO: Imagen de portada (Se oculta en móviles para mejor experiencia) */}
            <div className="col-12 col-lg-6 col-xl-8 d-none d-lg-block">
                <div
                    className="bg-cover h-100"
                    style={{
                        // Puedes cambiar esta URL por cualquier imagen de tu empresa
                        backgroundImage: "url(https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop)",
                        backgroundPosition: "center",
                    }}
                ></div>
            </div>

            {/* LADO DERECHO: Formulario de Login */}
            <div className="col-12 col-lg-6 col-xl-4 d-flex flex-column justify-content-center bg-white border-top-wide border-primary">
                <div className="container container-tight my-5 px-lg-5">
                    <div className="text-center mb-4">
                        <h1 className="h1 text-primary fw-bold">FactorSystem</h1>
                    </div>

                    <h2 className="h3 text-center mb-3">Bienvenido de nuevo</h2>
                    <p className="text-muted text-center mb-4">Ingresa a tu cuenta para continuar</p>

                    {errorMsg && (
                        <div className="alert alert-danger" role="alert">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/* Input de Usuario/Correo con Icono */}
                        <div className="mb-3">
                            <label className="form-label">Usuario o Correo Electrónico</label>
                            <div className="input-icon">
                                <span className="input-icon-addon">
                                    {/* Icono de usuario (Tabler Icons) */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                        <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
                                    </svg>
                                </span>
                                <input type="text" className="form-control form-control-lg" placeholder="admin o admin@empresa.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
                            </div>
                        </div>

                        {/* Input de Contraseña con Icono */}
                        <div className="mb-4">
                            <label className="form-label">Contraseña</label>
                            <div className="input-icon">
                                <span className="input-icon-addon">
                                    {/* Icono de candado (Tabler Icons) */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                                        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                                        <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                                    </svg>
                                </span>
                                <input type="password" className="form-control form-control-lg" placeholder="Tu contraseña secreta" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                        </div>

                        <div className="form-footer">
                            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loginMutation.isPending}>
                                {loginMutation.isPending ? "Validando credenciales..." : "Iniciar Sesión"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
