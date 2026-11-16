import { useState, useEffect } from "react";
import { useCreatePlannerMutation } from "../mutations/useCreatePlannerMutation";
import { useUpdatePlannerMutation } from "../mutations/useUpdatePlannerMutation";

// Helper puro: soporta tanto instancias Date de JS como strings SQL ("YYYY-MM-DD HH:mm:ss" o ISO)
const parseEventDate = (rawDate) => {
    if (!rawDate) return { date: "", time: "" };

    if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
        const year = rawDate.getFullYear();
        const month = String(rawDate.getMonth() + 1).padStart(2, "0");
        const day = String(rawDate.getDate()).padStart(2, "0");
        const hours = String(rawDate.getHours()).padStart(2, "0");
        const minutes = String(rawDate.getMinutes()).padStart(2, "0");

        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`,
        };
    }

    const normalized = String(rawDate).replace("T", " ");
    const [datePart, timePart] = normalized.split(" ");

    return {
        date: datePart || "",
        time: timePart ? timePart.substring(0, 5) : "",
    };
};

// Helper puro: extrae nombres de etiquetas sin importar si llegan como objetos { id, name } o strings
const normalizeTagNames = (rawTags = []) => {
    if (!Array.isArray(rawTags)) return [];

    return rawTags
        .map((tag) => (typeof tag === "string" ? tag : tag?.name))
        .filter(Boolean)
        .map((name) => name.trim().toLowerCase());
};

export const usePlannerForm = ({ initialData, selectedDate, userId, onClose }) => {
    const isEditing = Boolean(initialData?.id);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);

    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [errors, setErrors] = useState({});

    const { mutateAsync: createPlanner, isPending: isCreating } = useCreatePlannerMutation();
    const { mutateAsync: updatePlanner, isPending: isUpdating } = useUpdatePlannerMutation();

    const isPending = isCreating || isUpdating;

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");

            // Resolvemos descripción desde raíz o desde extendedProps
            const resolvedDescription = initialData.description ?? initialData.extendedProps?.description ?? "";
            setDescription(resolvedDescription);

            // Resolvemos etiquetas desde raíz o desde extendedProps
            const rawTags = initialData.tags ?? initialData.extendedProps?.tags ?? [];
            setTags(normalizeTagNames(rawTags));

            // Resolvemos fechas priorizando strings originales o instancias Date del calendario
            const rawStart = initialData.extendedProps?.originalStart ?? initialData.start ?? initialData.start_date;
            const rawEnd = initialData.extendedProps?.originalEnd ?? initialData.end ?? initialData.end_date;

            const start = parseEventDate(rawStart);
            const end = parseEventDate(rawEnd);

            setStartDate(start.date);
            setEndDate(end.date);

            // Si el evento es de todo el día, dejamos las horas vacías en el formulario
            if (initialData.allDay) {
                setStartTime("");
                setEndTime("");
            } else {
                setStartTime(start.time);
                setEndTime(end.time);
            }
        } else {
            setTitle("");
            setDescription("");
            setTags([]);
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
            setTags((prev) => [...prev, formattedTag]);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags((prev) => prev.filter((t) => t !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validación básica de UX antes de enviar a Laravel
        if (startDate && endDate && startDate > endDate) {
            setErrors({ end_date: ["La fecha final no puede ser anterior a la fecha de inicio."] });
            return;
        }

        const formattedStartDate = startTime ? `${startDate} ${startTime}:00` : startDate;
        const formattedEndDate = endDate ? (endTime ? `${endDate} ${endTime}:00` : endDate) : null;
        const isAllDay = !startTime && !endTime;

        const payload = {
            ...(userId ? { user_id: userId } : {}),
            title,
            description,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            all_day: isAllDay,
            tags,
        };

        try {
            if (isEditing) {
                await updatePlanner({ id: initialData.id, data: payload });
            } else {
                await createPlanner(payload);
            }

            onClose();
        } catch (err) {
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
