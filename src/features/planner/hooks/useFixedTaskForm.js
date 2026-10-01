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
};

// 🚀 Agregamos isOpen a los parámetros
export const useFixedTaskForm = (initialData, isOpen, onSubmitCallback) => {
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [step, setStep] = useState(1);

    // 🚀 Ahora el efecto escucha a isOpen. Cada vez que se abra el modal, evaluará qué hacer.
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const rawRules = initialData.rules || [];
                const currentTagIds = initialData.tags ? initialData.tags.map((t) => t.id) : [];
                let adaptedSchedules = [{ ...DEFAULT_SCHEDULE }];
                let adaptedMonthly = {};

                if (initialData.recurrence_type === "work_shift" && rawRules.length > 0) {
                    adaptedSchedules = rawRules.map((rule) => ({
                        days_of_week: Array.isArray(rule.days_of_week) ? rule.days_of_week.map(Number) : [],
                        start_time: rule.start_time || "",
                        end_time: rule.end_time || "",
                    }));
                } else if (initialData.recurrence_type === "monthly_reminder" && rawRules.length > 0) {
                    adaptedMonthly = {
                        day_of_month: rawRules[0].day_of_month ?? "",
                        requires_business_day: rawRules[0].requires_business_day ?? false,
                    };
                }

                setFormData({
                    ...DEFAULT_FORM_DATA,
                    ...initialData,
                    ...adaptedMonthly,
                    schedules: adaptedSchedules,
                    rotation_week: rawRules[0]?.rotation_week ?? "",
                    notebook_id: initialData.notebook_id ?? "",
                    tag_ids: currentTagIds,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitCallback(formData);
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
        handleReset: () => setFormData(DEFAULT_FORM_DATA),
        handleSubmit,
        isEditing: !!initialData,
        handleToggleFormTag,
    };
};
