import React, { useMemo, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment/min/moment-with-locales";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { IconClock, IconCalendarEvent, IconTag } from "@tabler/icons-react";

const localizer = momentLocalizer(moment);

/**
 * 🚀 CAPA 2: COMPONENTE PRESENTACIONAL DE CALENDARIO
 * Renderiza el calendario principal con soporte multi-vista, densidad dinámica y agenda timeline.
 */
export const BigCalendarView = ({ events = [], resources = [], controls = {}, selectedTags = [], onEventClick, onDateSelect, onWeekClick }) => {
    const {
        currentDate = new Date(),
        currentView = "month",
        changeDate = () => {},
        changeView = () => {},
        currentLocale = "es",
        maxEvents = 3, // Límite predeterminado por día
    } = controls;

    const normalizedLocale = String(currentLocale).toLowerCase();

    // 🚀 RESPONSIVIDAD: Detecta si el dispositivo es móvil (< 768px)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            const mobileState = window.innerWidth < 768;
            setIsMobile(mobileState);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 🚀 REGLA DE NEGOCIO VISUAL: En móviles la vista por defecto debe ser "agenda"
    useEffect(() => {
        if (isMobile && currentView !== "agenda") {
            changeView("agenda");
        }
    }, [isMobile]);

    useEffect(() => {
        moment.updateLocale(normalizedLocale, {
            week: {
                dow: 1, // La semana comienza en Lunes
            },
        });
        moment.locale(normalizedLocale);
    }, [normalizedLocale]);

    // 🚀 COMPONENTES PERSONALIZADOS DEL DESIGN SYSTEM (Tabler UI)
    const customComponents = useMemo(
        () => ({
            header: ({ label }) => <div className="text-capitalize fw-bold py-1 text-secondary">{label}</div>,

            month: {
                dateHeader: ({ label }) => (
                    <div className="text-end px-1 mt-1">
                        <span style={{ fontSize: "0.85rem" }} className="text-muted fw-bold text-capitalize">
                            {label}
                        </span>
                    </div>
                ),
            },

            // 1. Renderizado de Eventos en Vista Mes/Semana
            event: ({ event }) => {
                const startTime = moment(event.start).format("HH:mm");
                const endTime = moment(event.end).format("HH:mm");
                const hasActiveFilters = selectedTags.length > 0;

                return (
                    <div className="d-flex flex-column h-100 p-1 overflow-hidden" style={{ lineHeight: "1.2" }}>
                        <div className="fw-bold text-truncate" style={{ fontSize: "0.82rem" }}>
                            {event.title}
                        </div>

                        <div className="text-truncate opacity-75 my-1 d-flex align-items-center gap-1" style={{ fontSize: "0.7rem" }}>
                            <IconClock size={11} />
                            <span>
                                {startTime} - {endTime}
                            </span>
                        </div>

                        {event.tags && event.tags.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mt-auto pt-1">
                                {event.tags.map((tag) => {
                                    const isHighlighted = hasActiveFilters ? selectedTags.includes(tag.id) : true;
                                    const badgeClasses = isHighlighted ? `bg-white text-${tag.color || "primary"} shadow-sm` : `bg-transparent border border-white text-white opacity-50`;

                                    return (
                                        <span key={tag.id} className={`badge ${badgeClasses}`} style={{ fontSize: "0.6rem", padding: "0.15rem 0.3rem" }}>
                                            {tag.name}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            },

            // 2. Columna táctil para selección de semanas completas
            dateCellWrapper: (props) => {
                const isMonday = moment(props.value).isoWeekday() === 1;
                const weekNumber = moment(props.value).isoWeek();

                if (!isMonday || currentView !== "month") return props.children;

                return React.cloneElement(props.children, { className: `${props.children.props.className} position-relative` }, [
                    <div
                        key="week-column"
                        className="d-flex align-items-center justify-content-center bg-light border-end"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "24px",
                            cursor: "pointer",
                            zIndex: 4,
                            transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.className = "d-flex align-items-center justify-content-center bg-primary-lt border-end")}
                        onMouseLeave={(e) => (e.currentTarget.className = "d-flex align-items-center justify-content-center bg-light border-end")}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onWeekClick) onWeekClick(weekNumber, props.value);
                        }}
                        title={`Configurar Semana ${weekNumber}`}
                    >
                        <span className="text-muted fw-bold" style={{ fontSize: "0.7rem", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                            S. {weekNumber}
                        </span>
                    </div>,
                    props.children.props.children,
                ]);
            },

            // 🚀 3. DISEÑO PERSONALIZADO: Vista Agenda Tipo Línea de Tiempo (Timeline)
            agenda: {
                date: ({ date, label }) => (
                    <div className="py-2 border-bottom fw-bold text-white text-capitalize d-flex align-items-center gap-2">
                        <IconCalendarEvent size={18} />
                        <span>{label}</span>
                    </div>
                ),
                time: ({ event }) => {
                    const startTime = moment(event.start).format("HH:mm");
                    const endTime = moment(event.end).format("HH:mm");
                    return (
                        <div className="d-flex align-items-center justify-content-center h-100 pe-3">
                            <span className="badge bg-white-lt text-white px-2 py-1 rounded-pill d-flex align-items-center gap-1 font-monospace" style={{ fontSize: "0.75rem" }}>
                                <IconClock size={12} />
                                {startTime} - {endTime}
                            </span>
                        </div>
                    );
                },
                event: ({ event }) => (
                    <div className="card shadow-sm border-0 border-start border-3 my-1 cursor-pointer transition-base hover-shadow-md" style={{ borderColor: `var(--tblr-${event.color || "white"})` }} onClick={() => onEventClick && onEventClick(event.id)}>
                        <div className="card-body p-2">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                                <h4 className="card-title h5 m-0 text-truncate">{event.title}</h4>
                                {event.tags && event.tags.length > 0 && (
                                    <div className="d-flex gap-1">
                                        {event.tags.map((tag) => (
                                            <span key={tag.id} className={`badge bg-${tag.color || "secondary"}-lt`} style={{ fontSize: "0.65rem" }}>
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {event.description && (
                                <p className="text-secondary small mb-0 text-truncate-2" style={{ fontSize: "0.8rem" }}>
                                    {event.description}
                                </p>
                            )}
                        </div>
                    </div>
                ),
            },
        }),
        [onWeekClick, selectedTags, currentView, onEventClick],
    );

    return (
        <Calendar
            className="pb-1"
            localizer={localizer}
            events={events}
            resources={resources.length > 0 ? resources : null}
            culture={normalizedLocale}
            date={currentDate}
            view={currentView}
            onNavigate={changeDate}
            onView={changeView}
            toolbar={false}
            step={30}
            showMultiDayTimes
            selectable
            // 🚀 LÍMITE DINÁMICO DE EVENTOS: Controla el colapso por celda
            max={maxEvents === 0 ? Infinity : maxEvents}
            // 🚀 ACCIÓN AL PRESIONAR "+ N MÁS": Cambia el calendario a la vista Diaria
            onShowMore={(moreEvents, date) => {
                changeDate(date);
                changeView("day");
            }}
            onSelectEvent={(event) => onEventClick && onEventClick(event.id)}
            onSelectSlot={(slotInfo) => onDateSelect && onDateSelect(slotInfo)}
            components={customComponents}
            eventPropGetter={(event) => ({
                style: {
                    backgroundColor: `var(--tblr-${event.color || "primary"})`,
                    borderColor: `var(--tblr-${event.color || "primary"})`,
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "0.8rem",
                    marginLeft: currentView === "month" && moment(event.start).isoWeekday() === 1 ? "24px" : "0px",
                },
            })}
        />
    );
};
