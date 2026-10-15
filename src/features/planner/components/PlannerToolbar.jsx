import moment from "moment";
import { IconChevronLeft, IconChevronRight, IconCalendarEvent, IconCalendarMonth, IconCalendarWeek, IconCalendar, IconList, IconWorld, IconChevronDown } from "@tabler/icons-react";

// 🚀 ARQUITECTURA: Constante de configuración.
// Si en el futuro todo el ERP cambia de idioma, mueve este array a src/shared/constants/locales.js
export const SUPPORTED_LOCALES = [
    { code: "es", label: "Español" },
    { code: "en-gb", label: "English" },
    { code: "zh-cn", label: "中文 (Chino)" },
    { code: "hi", label: "हिन्दी (Hindi)" },
    { code: "ar", label: "العربية (Árabe)" },
    { code: "fr", label: "Français" },
    { code: "bn", label: "বাংলা (Bengalí)" },
    { code: "ru", label: "Русский (Ruso)" },
    { code: "pt", label: "Português" },
    { code: "de", label: "Deutsch" },
];

export const PlannerToolbar = ({ controls }) => {
    const { currentDate, currentView, goToNext, goToPrev, goToToday, changeView, currentLocale = "es", changeLocale = () => {} } = controls;

    // Buscamos el objeto completo del idioma actual para mostrar su etiqueta
    const currentLanguage = SUPPORTED_LOCALES.find((l) => l.code === currentLocale) || SUPPORTED_LOCALES[0];

    const getToolbarTitle = () => {
        const localMoment = moment(currentDate).locale(currentLocale);

        if (currentView === "month") return localMoment.format("MMMM YYYY");

        if (currentView === "day") return localMoment.format("dddd, D [de] MMMM YYYY");

        return `Semana ${localMoment.format("w, YYYY")}`;
    };

    return (
        <div className="d-flex align-items-center justify-content-between mb-3">
            {/* IZQUIERDA: Controles de Navegación */}
            <div className="btn-group shadow-sm">
                <button className="btn btn-outline-primary" onClick={goToToday} title="Volver a hoy">
                    <IconCalendarEvent size={18} className="me-2" />
                    Hoy
                </button>

                <button className="btn btn-outline-primary btn-icon" onClick={goToPrev}>
                    <IconChevronLeft size={20} />
                </button>

                <button className="btn btn-outline-primary btn-icon" onClick={goToNext}>
                    <IconChevronRight size={20} />
                </button>
            </div>

            {/* CENTRO: Título Dinámico */}
            <h2 className="m-0 text-capitalize">{getToolbarTitle()}</h2>

            {/* DERECHA: Controles de Idioma y Vista Apilados */}
            <div className="d-flex flex-column align-items-end gap-2">
                {/* 🚀 ARRIBA: Selector Dropdown de Idioma */}
                <div className="dropdown">
                    <button className="btn btn-sm btn-outline-secondary dropdown-toggle shadow-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <IconWorld size={16} className="me-2" />
                        {currentLanguage.label}
                        {/* Tabler UI y Bootstrap 5 añaden la flecha automáticamente, pero puedes forzarla si lo deseas */}
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end shadow">
                        {SUPPORTED_LOCALES.map((locale) => (
                            <li key={locale.code}>
                                <button className={`dropdown-item ${currentLocale === locale.code ? "active" : ""}`} onClick={() => changeLocale(locale.code)}>
                                    {locale.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ABAJO: Controles de Vista */}
                <div className="btn-group shadow-sm">
                    <button className={`btn ${currentView === "month" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => changeView("month")}>
                        <IconCalendarMonth size={18} className="me-2" /> Mes
                    </button>

                    <button className={`btn ${currentView === "week" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => changeView("week")}>
                        <IconCalendarWeek size={18} className="me-2" /> Semana
                    </button>

                    <button className={`btn ${currentView === "day" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => changeView("day")}>
                        <IconCalendar size={18} className="me-2" /> Día
                    </button>

                    <button className={`btn ${currentView === "agenda" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => changeView("agenda")}>
                        <IconList size={18} className="me-2" /> Agenda
                    </button>
                </div>
            </div>
        </div>
    );
};
