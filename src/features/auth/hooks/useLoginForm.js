import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useLoginForm = () => {
    // 1. Inicializamos siempre con objetos y strings seguros (nunca null)
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Ruta de redirección segura hacia el Dashboard del ERP
    const fromPath = location.state?.from?.pathname || "/dashboard";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Limpiamos el error específico del campo al escribir
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            await login(formData);
            navigate(fromPath, { replace: true });
        } catch (err) {
            // Manejo robusto de errores de validación de Laravel (422) o credenciales (401)
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setErrors({
                    general: err.response?.data?.message || "Ocurrió un error al intentar iniciar sesión.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData: formData || { email: "", password: "" }, // Protección extra contra nulos
        errors: errors || {}, // Protección extra contra nulos
        handleChange,
        handleSubmit,
        isLoading,
    };
};
