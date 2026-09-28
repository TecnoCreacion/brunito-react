import { useState } from "react";
import { useForgotPasswordMutation } from "../mutations/useForgotPasswordMutation";

export const useForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null); // Para el mensaje de éxito de Laravel
    const [errors, setErrors] = useState({});

    const { mutateAsync: sendResetLink, isPending } = useForgotPasswordMutation();

    const handleChange = (e) => {
        setEmail(e.target.value);
        // Limpiamos errores y mensajes de estado al escribir
        if (errors.email) setErrors({ ...errors, email: null });
        if (status) setStatus(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setStatus(null);

        try {
            const response = await sendResetLink({ email });
            // Laravel suele devolver un campo 'status' con el mensaje de éxito
            setStatus(response.status || "Se ha enviado un enlace a tu correo.");
        } catch (err) {
            // Laravel responde con 422 para errores de validación (ej. email no existe)
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: "Ocurrió un error inesperado al intentar enviar el correo." });
            }
        }
    };

    return { email, handleChange, handleSubmit, isPending, errors, status };
};
