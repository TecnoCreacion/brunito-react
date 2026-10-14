import { useState } from "react";
import moment from "moment";

export const useCalendarControls = (initialView = "month") => {
    // Estado de la fecha actual visible en el calendario
    const [currentDate, setCurrentDate] = useState(new Date());
    // Estado de la vista actual (month, week, day, agenda)
    const [currentView, setCurrentView] = useState(initialView);

    // Navegación de tiempo
    const goToNext = () => setCurrentDate(moment(currentDate).add(1, currentView).toDate());
    const goToPrev = () => setCurrentDate(moment(currentDate).subtract(1, currentView).toDate());
    const goToToday = () => setCurrentDate(new Date());

    // Cambio de fecha exacta (Para conectar el mini-calendario)
    const changeDate = (date) => setCurrentDate(date);

    // Cambio de vista
    const changeView = (view) => setCurrentView(view);

    return {
        currentDate,
        currentView,
        goToNext,
        goToPrev,
        goToToday,
        changeDate,
        changeView,
    };
};
