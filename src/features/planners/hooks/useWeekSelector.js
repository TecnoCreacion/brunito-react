import { useState, useEffect } from "react";

export const useWeekSelector = (isOpen, onSaveCallback) => {
    // 🚀 Estado para almacenar el arreglo de semanas seleccionadas [42, 43, 44]
    const [selectedWeeks, setSelectedWeeks] = useState([]);

    // Limpiamos el estado cada vez que se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setSelectedWeeks([]);
        }
    }, [isOpen]);

    const toggleWeek = (weekNumber) => {
        setSelectedWeeks((prev) => {
            if (prev.includes(weekNumber)) {
                return prev.filter((w) => w !== weekNumber); // Quitar si existe
            }
            return [...prev, weekNumber].sort((a, b) => a - b); // Agregar y ordenar
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSaveCallback(selectedWeeks);
    };

    return {
        selectedWeeks,
        toggleWeek,
        handleSave,
        isReadyToSave: selectedWeeks.length > 0,
    };
};
