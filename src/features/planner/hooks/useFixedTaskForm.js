import { useState, useEffect } from "react";

const DEFAULT_SCHEDULE = { days_of_week: [], start_time: "", end_time: "", tag_ids: [] };

const DEFAULT_FORM_DATA = {
    title: "",
    recurrence_type: "",
    schedules: [{ ...DEFAULT_SCHEDULE }],
    rotation_week: "",
    day_of_month: "",
    requires_business_day: false,
    notebook_id: "",
    tags: [],
};

// 🚀 Agregamos isOpen a los parámetros
export const useFixedTaskForm = (initialData, isOpen, onSubmitCallback) => {
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [step, setStep] = useState(1);
    const [tagInput, setTagInput] = useState("");

    // 🚀 Ahora el efecto escucha a isOpen. Cada vez que se abra el modal, evaluará qué hacer.
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    ...DEFAULT_FORM_DATA,
                    ...initialData,
                });

                setStep(2);
            } else {
                setFormData(DEFAULT_FORM_DATA);

                setStep(1);
            }
        }
    }, [isOpen, initialData]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddSchedule = () => {
        setFormData((prev) => ({ ...prev, schedules: [...prev.schedules, { ...DEFAULT_SCHEDULE }] }));
    };

    const handleRemoveSchedule = (index) => {
        setFormData((prev) => ({
            ...prev,
            schedules: prev.schedules.filter((_, i) => i !== index),
        }));
    };

    const handleScheduleChange = (index, field, value) => {
        setFormData((prev) => {
            const newSchedules = [...prev.schedules];
            newSchedules[index] = { ...newSchedules[index], [field]: value };
            return { ...prev, schedules: newSchedules };
        });
    };

    const handleToggleDay = (index, dayId) => {
        setFormData((prev) => {
            const newSchedules = [...prev.schedules];
            const currentDays = newSchedules[index].days_of_week;
            const updatedDays = currentDays.includes(dayId) ? currentDays.filter((d) => d !== dayId) : [...currentDays, dayId];

            newSchedules[index] = { ...newSchedules[index], days_of_week: updatedDays };
            return { ...prev, schedules: newSchedules };
        });
    };

    // 🚀 Lógica de etiquetas encapsulada
    const handleAddTag = (tagToAdd) => {
        const trimmedTag = tagToAdd.trim();
        if (!trimmedTag) return;

        setFormData((prev) => {
            const currentTags = prev.tags || [];
            if (currentTags.includes(trimmedTag)) return prev;
            return { ...prev, tags: [...currentTags, trimmedTag] };
        });

        setTagInput("");
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: (prev.tags || []).filter((t) => t !== tagToRemove),
        }));
    };

    // 🚀 NUEVA FUNCIÓN: Alternar la selección de una etiqueta
    const handleToggleFormTag = (tagId) => {
        setFormData((prev) => {
            const currentTags = prev.tag_ids || [];
            const newTags = currentTags.includes(tagId)
                ? currentTags.filter((id) => id !== tagId) // Remover si ya existe
                : [...currentTags, tagId]; // Agregar si no existe

            return { ...prev, tag_ids: newTags };
        });
    };

    return {
        formData,
        step,
        setStep,
        handleChange,
        handleAddSchedule,
        handleRemoveSchedule,
        handleScheduleChange,
        handleToggleDay,
        handleNextStep: () => setStep(2),
        tagInput, // 🚀 Exportamos el estado del input
        setTagInput, // 🚀 Exportamos el setter
        handleAddTag, // 🚀 Función para agregar
        handleRemoveTag, // 🚀 Función para quitar
        handleReset: () => {
            setFormData(DEFAULT_FORM_DATA);
            setTagInput("");
        },
        handleSubmit: (e) => {
            e.preventDefault();
            onSubmitCallback(formData);
        },
        handleToggleFormTag,
        isEditing: !!initialData,
    };
};
