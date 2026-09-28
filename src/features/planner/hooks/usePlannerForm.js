import { useState, useEffect } from "react";
import { useCreatePlannerMutation } from "../mutations/useCreatePlannerMutation";
import { useUpdatePlannerMutation } from "../mutations/useUpdatePlannerMutation";

export const usePlannerForm = ({ initialData, selectedDate, userId, onClose }) => {
    // Si hay initialData, estamos editando; si no, estamos creando
    const isEditing = Boolean(initialData);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);

    // Estados desglosados para soportar el nuevo diseño del formulario
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [errors, setErrors] = useState({});

    const { mutateAsync: createPlanner, isPending: isCreating } = useCreatePlannerMutation();
    const { mutateAsync: updatePlanner, isPending: isUpdating } = useUpdatePlannerMutation();

    const isPending = isCreating || isUpdating;

    // Helper puro para separar fechas de Laravel ("2026-08-11 10:00:00" o "2026-08-11T10:00:00")
    const parseDbDate = (dbDate) => {
        if (!dbDate) return { date: "", time: "" };

        const normalized = dbDate.replace("T", " ");
        const [datePart, timePart] = normalized.split(" ");

        return {
            date: datePart || "",
            time: timePart ? timePart.substring(0, 5) : "", // Cortamos los segundos, solo queremos "HH:mm"
        };
    };

    // Sincronizamos el estado cuando el modal se abre con datos iniciales
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.extendedProps?.description || "");
            setTags(initialData.extendedProps?.tags?.map((t) => t.name) || []);

            const start = parseDbDate(initialData.extendedProps?.originalStart);
            setStartDate(start.date);
            setStartTime(start.time);

            const end = parseDbDate(initialData.extendedProps?.originalEnd);
            setEndDate(end.date);
            setEndTime(end.time);
        } else {
            setTitle("");
            setDescription("");
            setTags([]);
            // Por defecto, asignamos la fecha seleccionada en el calendario
            setStartDate(selectedDate || "");
            setStartTime("");
            setEndDate("");
            setEndTime("");
        }

        setErrors({});
    }, [initialData, selectedDate]);

    const handleAddTag = (tagName) => {
        const formattedTag = tagName.trim().toLowerCase();
        if (formattedTag && !tags.includes(formattedTag)) {
            setTags([...tags, formattedTag]);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // 1. Validaciones rápidas de Frontend (Mejoran la UX)
        if (startDate && endDate && startDate > endDate) {
            setErrors({ end_date: ["La fecha final no puede ser anterior a la fecha de inicio."] });
            return; // Detenemos el envío para que el usuario corrija
        }

        // 2. Ensamblaje de Fechas y Horas para la API (Laravel)
        // Convertimos los estados separados nuevamente a "YYYY-MM-DD HH:mm:ss"
        const formattedStartDate = startTime ? `${startDate} ${startTime}:00` : startDate;
        const formattedEndDate = endDate ? (endTime ? `${endDate} ${endTime}:00` : endDate) : null;

        // Si no hay hora de inicio ni de fin, asumimos que el evento dura todo el día
        const isAllDay = !startTime && !endTime;

        const payload = {
            user_id: userId,
            title,
            description,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            all_day: isAllDay,
            tags,
        };

        // 3. Envío a la Capa de Mutación
        try {
            if (isEditing) {
                await updatePlanner({ id: initialData.id, data: payload });
            } else {
                await createPlanner(payload);
            }

            onClose(); // Cerramos el modal tras el éxito
        } catch (err) {
            // Manejamos los errores 422 de Laravel, enlazándolos a los inputs del formulario
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setErrors({ general: "Error al guardar el recordatorio. Intenta nuevamente." });
            }
        }
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
        startDate,
        setStartDate,
        startTime,
        setStartTime,
        endDate,
        setEndDate,
        endTime,
        setEndTime,
        tags,
        handleAddTag,
        handleRemoveTag,
        isPending,
        isEditing,
        errors,
        handleSubmit,
    };
};
