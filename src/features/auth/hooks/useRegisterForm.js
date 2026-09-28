import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../mutations/useRegisterMutation";
import { useAuth } from "./useAuth";

export const useRegisterForm = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", password_confirmation: "" });
    const [errors, setErrors] = useState({});

    const { mutateAsync: registerUser, isPending } = useRegisterMutation();
    const { login } = useAuth(); // Reutilizamos la lógica del contexto global
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Limpiamos el error del campo específico al escribir
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await registerUser(formData);
            // Si Laravel registra e inicia sesión automáticamente ( Sanctum SPA ),
            // o si necesitas forzar el login después del registro:
            await login({ email: formData.email, password: formData.password });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            // Laravel responde con 422 para errores de validación.
            // React solo muestra estos errores, no valida las reglas de negocio.
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: "Ocurrió un error inesperado al crear la cuenta." });
            }
        }
    };

    return { formData, handleChange, handleSubmit, isPending, errors };
};
