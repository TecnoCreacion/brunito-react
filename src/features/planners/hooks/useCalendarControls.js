import { useState } from "react";
import moment from "moment";

/**
 * 🚀 CAPA 3: HOOK PRESENTACIONAL DE CONTROL DE CALENDARIO
 * Administra el estado temporal y la densidad de eventos sin exponer detalles de UI.
 */
export const useCalendarControls = (initialView = "month") => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState(initialView);
    const [currentLocale, setCurrentLocale] = useState("es");
    const [maxEvents, setMaxEvents] = useState(3);

    // Helper defensivo: Traduce 'agenda' a una unidad reconocida por Moment.js
    const getUnitForMoment = (view) => {
        if (view === "agenda") return "month"; // En vista agenda avanzamos por mes
        return view;
    };

    // Navegación de tiempo desacoplada
    const goToNext = () => {
        const unit = getUnitForMoment(currentView);
        setCurrentDate(moment(currentDate).add(1, unit).toDate());
    };

    const goToPrev = () => {
        const unit = getUnitForMoment(currentView);
        setCurrentDate(moment(currentDate).subtract(1, unit).toDate());
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const changeDate = (date) => setCurrentDate(date);
    const changeView = (view) => setCurrentView(view);
    const changeLocale = (locale) => setCurrentLocale(locale);
    const changeMaxEvents = (limit) => setMaxEvents(limit);

    return {
        currentDate,
        currentView,
        currentLocale,
        maxEvents,
        goToNext,
        goToPrev,
        goToToday,
        changeDate,
        changeView,
        changeLocale,
        changeMaxEvents,
    };
};
