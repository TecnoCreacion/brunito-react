import { useState, useEffect, useMemo } from "react";
import { useCreatePlannerMutation } from "../mutations/useCreatePlannerMutation";
import { useUpdatePlannerMutation } from "../mutations/useUpdatePlannerMutation";
import { usePlannerTagsQuery } from "../queries/usePlannerTagsQuery";

const DEFAULT_RECOMMENDED_TAGS = [
    { id: "importante", name: "Importante", color: "danger" },
    { id: "médico", name: "Médico", color: "info" },
    { id: "trabajo", name: "Trabajo", color: "primary" },
    { id: "familia", name: "Familia", color: "success" },
    { id: "urgente", name: "Urgente", color: "warning" },
    { id: "reunión", name: "Reunión", color: "secondary" },
    { id: "proyecto", name: "Proyecto", color: "dark" },
];

// Helper puro: convierte cualquier entrada (string, objeto API o sugerencia) a modelo uniforme de Frontend
const toFrontendTag = (rawTag) => {
    if (!rawTag) return null;

    if (typeof rawTag === "string") {
        const cleanName = rawTag.trim();
        if (!cleanName) return null;
        return {
            id: cleanName.toLowerCase(),
            name: cleanName,
            color: "primary",
        };
    }

    const cleanName = (rawTag.name || "").trim();
    if (!cleanName) return null;

    return {
        id: rawTag.id ?? cleanName.toLowerCase(),
        name: cleanName,
        color: rawTag.color || "primary",
    };
};

// Helper puro: soporta instancias Date o strings SQL ("YYYY-MM-DD HH:mm:ss")
const parseEventDate = (rawDate) => {
    if (!rawDate) return { date: "", time: "" };

    if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
        const year = rawDate.getFullYear();
        const month = String(rawDate.getMonth() + 1).padStart(2, "0");
        const day = String(rawDate.getDate()).padStart(2, "0");
        const hours = String(rawDate.getHours()).padStart(2, "0");
        const minutes = String(rawDate.getMinutes()).padStart(2, "0");
        return { date: `${year}-${month}-${day}`, time: `${hours}:${minutes}` };
    }

    const normalized = String(rawDate).replace("T", " ");
    const [datePart, timePart] = normalized.split(" ");
    return {
        date: datePart || "",
        time: timePart ? timePart.substring(0, 5) : "",
    };
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

    // 1. Obtenemos las etiquetas persistidas del usuario desde TanStack Query
    const { data: userSavedTags = [] } = usePlannerTagsQuery();

    const { mutateAsync: createPlanner, isPending: isCreating } = useCreatePlannerMutation();
    const { mutateAsync: updatePlanner, isPending: isUpdating } = useUpdatePlannerMutation();
    const isPending = isCreating || isUpdating;

    // 2. Sincronizamos estado inicial al abrir o cambiar registro
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.description ?? initialData.extendedProps?.description ?? "");

            const rawTags = initialData.tags ?? initialData.extendedProps?.tags ?? [];
            const normalizedTags = Array.isArray(rawTags) ? rawTags.map(toFrontendTag).filter(Boolean) : [];
            setTags(normalizedTags);

            const rawStart = initialData.extendedProps?.originalStart ?? initialData.start ?? initialData.start_date;
            const rawEnd = initialData.extendedProps?.originalEnd ?? initialData.end ?? initialData.end_date;

            const start = parseEventDate(rawStart);
            const end = parseEventDate(rawEnd);

            setStartDate(start.date);
            setEndDate(end.date);
            setStartTime(initialData.allDay ? "" : start.time);
            setEndTime(initialData.allDay ? "" : end.time);
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

    // 3. Fusionamos etiquetas del usuario (prioritarias) + sugerencias sin duplicar por nombre
    const availableTags = useMemo(() => {
        const mergedMap = new Map();

        // Primero cargamos las del usuario (tienen su color e ID real de BD)
        if (Array.isArray(userSavedTags)) {
            userSavedTags.forEach((tag) => {
                const normalized = toFrontendTag(tag);
                if (normalized) {
                    mergedMap.set(normalized.name.toLowerCase(), normalized);
                }
            });
        }

        // Luego agregamos las recomendadas que aún no existan en el catálogo del usuario
        DEFAULT_RECOMMENDED_TAGS.forEach((recTag) => {
            const key = recTag.name.toLowerCase();
            if (!mergedMap.has(key)) {
                mergedMap.set(key, recTag);
            }
        });

        // Filtramos las que ya están seleccionadas en el evento actual
        const selectedNames = new Set(tags.map((t) => t.name.toLowerCase()));
        return Array.from(mergedMap.values()).filter((tag) => !selectedNames.has(tag.name.toLowerCase()));
    }, [userSavedTags, tags]);

    // 4. Agregar etiqueta aceptando tanto string manual como objeto seleccionado
    const handleAddTag = (tagInput) => {
        const normalized = toFrontendTag(tagInput);
        if (!normalized) return;

        setTags((prev) => {
            const alreadySelected = prev.some((t) => t.name.toLowerCase() === normalized.name.toLowerCase());
            if (alreadySelected) return prev;

            // Si el usuario escribió manualmente el nombre de una etiqueta que ya existía en BD, heredamos su color e ID
            const existingFromCatalog = Array.isArray(userSavedTags) ? userSavedTags.map(toFrontendTag).find((t) => t?.name.toLowerCase() === normalized.name.toLowerCase()) : null;

            return [...prev, existingFromCatalog || normalized];
        });
    };

    const handleRemoveTag = (tagToRemove) => {
        const targetName = toFrontendTag(tagToRemove)?.name.toLowerCase();
        setTags((prev) => prev.filter((t) => t.name.toLowerCase() !== targetName));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

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
            // Enviamos los nombres normalizados que espera tu endpoint de sincronización en Laravel
            tags: tags.map((t) => t.name.toLowerCase()),
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
        availableTags,
        handleAddTag,
        handleRemoveTag,
        isPending,
        isEditing,
        errors,
        handleSubmit,
    };
};
