import { useState, useEffect, useMemo } from "react";

const DEFAULT_SCHEDULE = { days_of_week: [], start_time: "", end_time: "" };

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

export const useFixedTaskForm = ({ initialData, isOpen, availableTags = [], onSubmitCallback }) => {
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            const normalizedTags = Array.isArray(initialData.tags) ? initialData.tags.map(toFrontendTag).filter(Boolean) : [];

            setFormData({
                ...DEFAULT_FORM_DATA,
                ...initialData,
                tags: normalizedTags,
            });
            setStep(2);
        } else {
            setFormData(DEFAULT_FORM_DATA);
            setStep(1);
        }
    }, [isOpen, initialData]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddSchedule = () => {
        setFormData((prev) => ({
            ...prev,
            schedules: [...prev.schedules, { ...DEFAULT_SCHEDULE }],
        }));
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

    const unselectedSuggestions = useMemo(() => {
        const normalizedCatalog = Array.isArray(availableTags) ? availableTags.map(toFrontendTag).filter(Boolean) : [];

        const selectedNames = new Set((formData.tags || []).map((t) => t.name.toLowerCase()));
        return normalizedCatalog.filter((tag) => !selectedNames.has(tag.name.toLowerCase()));
    }, [availableTags, formData.tags]);

    const handleAddTag = (tagInput) => {
        const normalizedTag = toFrontendTag(tagInput);
        if (!normalizedTag) return;

        setFormData((prev) => {
            const currentTags = prev.tags || [];
            const exists = currentTags.some((t) => t.name.toLowerCase() === normalizedTag.name.toLowerCase());
            if (exists) return prev;

            const existingMatch = unselectedSuggestions.find((t) => t.name.toLowerCase() === normalizedTag.name.toLowerCase());

            const tagToInsert = existingMatch ? { ...existingMatch, color: existingMatch.color || normalizedTag.color } : { id: `temp-${Date.now()}`, ...normalizedTag };

            return { ...prev, tags: [...currentTags, tagToInsert] };
        });
    };

    const handleRemoveTag = (tagToRemove) => {
        const normalized = toFrontendTag(tagToRemove);
        if (!normalized) return;

        const targetName = normalized.name.toLowerCase();

        setFormData((prev) => ({
            ...prev,
            tags: (prev.tags || []).filter((t) => {
                if (typeof t.id === "number" && typeof normalized.id === "number") {
                    return t.id !== normalized.id;
                }
                return t.name.toLowerCase() !== targetName;
            }),
        }));
    };

    const handleReset = () => {
        setFormData(DEFAULT_FORM_DATA);
        setStep(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            tags: (formData.tags || []).map((t) => ({
                name: t.name.trim(),
                color: t.color || "primary",
            })),
        };

        onSubmitCallback(payload);
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
        unselectedSuggestions,
        handleAddTag,
        handleRemoveTag,
        handleReset,
        handleSubmit,
        isEditing: Boolean(initialData?.id),
    };
};
