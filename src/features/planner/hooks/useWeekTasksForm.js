import { useState, useEffect } from "react";

export const useWeekTasksForm = (isOpen, initialTaskIds = [], onSaveCallback) => {
    // Guardamos las tareas seleccionadas.
    // Usamos un array que permite duplicados si el negocio exige agregar el mismo turno varias veces.
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedTaskIds([]);
        }

        setSelectedTaskIds([...initialTaskIds]);
    }, [isOpen]);

    // Función para agregar un turno a la bolsa de la semana
    const handleAddTask = (taskId) => {
        setSelectedTaskIds((prev) => [...prev, taskId]);
    };

    // Función para quitar un turno específico (por índice para no borrar duplicados del mismo ID)
    const handleRemoveTask = (indexToRemove) => {
        setSelectedTaskIds((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSaveCallback(selectedTaskIds);
    };

    return {
        selectedTaskIds,
        handleAddTask,
        handleRemoveTask,
        handleSave,
        isReadyToSave: selectedTaskIds.length > 0,
    };
};
