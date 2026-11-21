import { useState, useEffect } from "react";
import { useCreateTagMutation, useUpdateTagMutation } from "../mutations/usePlannerTagMutations";

export const TAG_COLOR_OPTIONS = [
    { value: "primary", label: "Azul (Primario)" },
    { value: "success", label: "Verde (Éxito)" },
    { value: "warning", label: "Amarillo (Advertencia)" },
    { value: "danger", label: "Rojo (Urgente)" },
    { value: "info", label: "Celeste (Info)" },
    { value: "purple", label: "Morado" },
    { value: "secondary", label: "Gris" },
];

export const usePlannerTagForm = ({ initialData = null, isOpen, onClose }) => {
    const isEditing = Boolean(initialData?.id);

    const [name, setName] = useState("");
    const [color, setColor] = useState("primary");
    const [errors, setErrors] = useState({});

    const { mutateAsync: createTag, isPending: isCreating } = useCreateTagMutation();
    const { mutateAsync: updateTag, isPending: isUpdating } = useUpdateTagMutation();

    const isPending = isCreating || isUpdating;

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setName(initialData.name || "");
            setColor(initialData.color || "primary");
        } else {
            setName("");
            setColor("primary");
        }
        setErrors({});
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validación básica de UX (Laravel mantiene la validación definitiva de unicidad y reglas de negocio)
        if (!name.trim()) {
            setErrors({ name: ["El nombre de la etiqueta es obligatorio."] });
            return;
        }

        try {
            if (isEditing) {
                await updateTag({ id: initialData.id, data: { name, color } });
            } else {
                await createTag({ name, color });
            }
            onClose();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setErrors({ general: "No se pudo guardar la etiqueta. Intenta nuevamente." });
            }
        }
    };

    return {
        name,
        setName,
        color,
        setColor,
        errors,
        isPending,
        isEditing,
        handleSubmit,
    };
};
