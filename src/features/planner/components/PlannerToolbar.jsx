import moment from "moment";
import "moment/locale/es";
import { IconChevronLeft, IconChevronRight, IconCalendarEvent, IconCalendarMonth, IconCalendarWeek, IconCalendar, IconList } from "@tabler/icons-react";

export const PlannerToolbar = ({ controls }) => {
    const { currentDate, currentView, goToNext, goToPrev, goToToday, changeView } = controls;

    // Formateamos el título según la vista (ej. "Octubre 2026" o "Semana 41")
    const getToolbarTitle = () => {
        if (currentView === "month") return moment(currentDate).format("MMMM YYYY");
        if (currentView === "day") return moment(currentDate).format("dddd, D [de] MMMM YYYY");
        return `Semana ${moment(currentDate).format("w, YYYY")}`;
    };

    return (
        <div className="d-flex align-items-center justify-content-between mb-3">
            {/* Controles de Navegación */}
            <div className="btn-group">
                <button className="btn btn-outline-primary" onClick={goToToday} title="Volver a hoy">
                    <IconCalendarEvent size={18} className="me-2" />
                    Hoy
                </button>

                {/* Agregamos la clase btn-icon de Tabler para botones que solo tienen un icono */}
                <button className="btn btn-outline-primary btn-icon" onClick={goToPrev} title="Anterior">
                    <IconChevronLeft size={20} />
                </button>

                <button className="btn btn-outline-primary btn-icon" onClick={goToNext} title="Siguiente">
                    <IconChevronRight size={20} />
                </button>
            </div>

            {/* Título Dinámico */}
            <h2 className="m-0 text-capitalize">{getToolbarTitle()}</h2>

            {/* Controles de Vista */}
            <div className="btn-group">
                <button className={`btn ${currentView === "month" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => changeView("month")}>
                    <IconCalendarMonth size={18} className="me-2" />
                    Mes
                </button>

                <button className={`btn ${currentView === "week" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => changeView("week")}>
                    <IconCalendarWeek size={18} className="me-2" />
                    Semana
                </button>

                <button className={`btn ${currentView === "day" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => changeView("day")}>
                    <IconCalendar size={18} className="me-2" />
                    Día
                </button>

                <button className={`btn ${currentView === "agenda" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => changeView("agenda")}>
                    <IconList size={18} className="me-2" />
                    Agenda
                </button>
            </div>
        </div>
    );
};
