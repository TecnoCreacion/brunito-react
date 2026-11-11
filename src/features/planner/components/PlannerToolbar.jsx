import moment from "moment";
import { IconChevronLeft, IconChevronRight, IconCalendarEvent, IconCalendarMonth, IconCalendarWeek, IconCalendar, IconList, IconWorld, IconSettings, IconEye } from "@tabler/icons-react";

// 🚀 ARQUITECTURA: Constantes de configuración compartidas del módulo
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

export const EVENT_LIMIT_OPTIONS = [
    { value: 1, label: "1 evento por día" },
    { value: 2, label: "2 eventos por día" },
    { value: 3, label: "3 eventos por día" },
    { value: 5, label: "5 eventos por día" },
    { value: 0, label: "Sin límite (Mostrar todos)" },
];

/**
 * 🚀 CAPA 2: COMPONENTE PRESENTACIONAL DE HERRAMIENTAS
 * Renderiza el título centrado y condensa las acciones en un menú de ajustes único.
 */
export const PlannerToolbar = ({ controls }) => {
    const { currentDate, currentView, goToNext, goToPrev, goToToday, changeView, currentLocale = "es", changeLocale = () => {}, maxEvents = 1, changeMaxEvents = () => {} } = controls;

    const getToolbarTitle = () => {
        const localMoment = moment(currentDate).locale(currentLocale);

        if (currentView === "month") return localMoment.format("MMMM YYYY");
        if (currentView === "day") return localMoment.format("dddd, D [de] MMMM YYYY");

        return `Semana ${localMoment.format("w, YYYY")}`;
    };

    return (
        <div className="d-flex align-items-center justify-content-between mb-3 py-2 px-1 border-bottom">
            {/* IZQUIERDA: Balanceador visual simétrico para centrar el título exacto en pantallas anchas */}
            <div style={{ minWidth: "130px" }} className="d-none d-md-block"></div>

            {/* CENTRO: Título Dinámico de la Vista */}
            <h2 className="m-0 text-capitalize text-center flex-grow-1">{getToolbarTitle()}</h2>

            {/* DERECHA: Dropdown Único con Controles y Preferencias */}
            <div className="dropdown ms-auto" style={{ minWidth: "130px", textAlignment: "right" }}>
                <button className="btn btn-outline-secondary dropdown-toggle shadow-sm d-inline-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                    <IconSettings size={18} />
                    <span className="d-none d-sm-inline">Controles</span>
                </button>

                <div className="dropdown-menu dropdown-menu-end shadow p-3" style={{ width: "290px", zIndex: 1050 }}>
                    {/* 1. SECCIÓN DE NAVEGACIÓN TEMPORAL */}
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-bold text-uppercase mb-2">Navegación</label>
                        <div className="d-flex gap-1 w-100">
                            <button className="btn btn-sm btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1" onClick={goToToday}>
                                <IconCalendarEvent size={16} /> Hoy
                            </button>
                            <button className="btn btn-sm btn-outline-primary btn-icon" onClick={goToPrev} title="Anterior">
                                <IconChevronLeft size={16} />
                            </button>
                            <button className="btn btn-sm btn-outline-primary btn-icon" onClick={goToNext} title="Siguiente">
                                <IconChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <hr className="dropdown-divider my-2" />

                    {/* 2. SECCIÓN DE MODO DE VISTA */}
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-bold text-uppercase mb-2">Vista del Calendario</label>
                        <div className="btn-group w-100" role="group">
                            <button className={`btn btn-sm ${currentView === "month" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => changeView("month")}>
                                <IconCalendarMonth size={14} className="me-1" /> Mes
                            </button>
                            <button className={`btn btn-sm ${currentView === "week" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => changeView("week")}>
                                <IconCalendarWeek size={14} className="me-1" /> Sem
                            </button>
                            <button className={`btn btn-sm ${currentView === "day" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => changeView("day")}>
                                <IconCalendar size={14} className="me-1" /> Día
                            </button>
                            <button className={`btn btn-sm ${currentView === "agenda" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => changeView("agenda")}>
                                <IconList size={14} className="me-1" /> Agenda
                            </button>
                        </div>
                    </div>

                    <hr className="dropdown-divider my-2" />

                    {/* 3. SECCIÓN DE LÍMITE VISUAL DE EVENTOS */}
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-bold text-uppercase mb-2 d-flex align-items-center gap-1">
                            <IconEye size={14} /> Límite de Eventos por Día
                        </label>
                        <select className="form-select form-select-sm" value={maxEvents} onChange={(e) => changeMaxEvents(Number(e.target.value))}>
                            {EVENT_LIMIT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <hr className="dropdown-divider my-2" />

                    {/* 4. SECCIÓN DE IDIOMA Y REGIONALIZACIÓN */}
                    <div>
                        <label className="form-label text-muted small fw-bold text-uppercase mb-2 d-flex align-items-center gap-1">
                            <IconWorld size={14} /> Idioma Regional
                        </label>
                        <select className="form-select form-select-sm" value={currentLocale} onChange={(e) => changeLocale(e.target.value)}>
                            {SUPPORTED_LOCALES.map((locale) => (
                                <option key={locale.code} value={locale.code}>
                                    {locale.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
