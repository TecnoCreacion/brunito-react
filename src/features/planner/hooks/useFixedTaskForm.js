import { useState, useEffect } from "react";

const DEFAULT_FORM_DATA = {
    title: "",
    recurrence_type: "",
    days_of_week: [],
    start_time: "",
    end_time: "",
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
                setFormData({
                    ...DEFAULT_FORM_DATA,
                    ...initialData,
                });
                setStep(2);
            } else {
                setFormData(DEFAULT_FORM_DATA);
                setStep(1);
            }
        } else {
            // Opcional pero recomendado: Limpiar el estado cuando se cierra
            // para evitar "parpadeos" de datos viejos la próxima vez que se abra
            setTimeout(() => {
                setFormData(DEFAULT_FORM_DATA);
                setStep(1);
            }, 300); // 300ms espera a que termine la animación de Bootstrap
        }
    }, [isOpen, initialData]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleToggleDay = (dayId) => {
        setFormData((prev) => {
            const days = prev.days_of_week.includes(dayId) ? prev.days_of_week.filter((d) => d !== dayId) : [...prev.days_of_week, dayId];
            return { ...prev, days_of_week: days };
        });
    };

    const handleNextStep = () => setStep(2);

    const handleReset = () => {
        setFormData(DEFAULT_FORM_DATA);
        setStep(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitCallback(formData);
    };

    return {
        formData,
        step,
        setStep,
        handleChange,
        handleToggleDay,
        handleNextStep,
        handleReset,
        handleSubmit,
        isEditing: !!initialData,
    };
};
