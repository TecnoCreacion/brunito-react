import React, { useMemo, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment/min/moment-with-locales";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { IconClock } from "@tabler/icons-react";

const localizer = momentLocalizer(moment);

export const BigCalendarView = ({
    events = [],
    resources = [],
    controls = {},
    selectedTags = [], // Recibimos los tags activos para la UI
    onEventClick,
    onDateSelect,
    onWeekClick,
}) => {
    const { currentDate = new Date(), currentView = "month", changeDate = () => {}, changeView = () => {}, currentLocale = "es" } = controls;
    const normalizedLocale = String(currentLocale).toLowerCase();

    useEffect(() => {
        moment.updateLocale(normalizedLocale, {
            week: {
                dow: 1,
            },
        });

        moment.locale(normalizedLocale);
    }, [normalizedLocale]);

    //const localizer = useMemo(() => momentLocalizer(moment), []);

    const customComponents = useMemo(
        () => ({
            header: ({ label }) => <div className="text-capitalize fw-bold py-1">{label}</div>,
            month: {
                dateHeader: ({ label }) => (
                    <div className="text-end px-1 mt-1">
                        <span style={{ cursor: "pointer", fontSize: "0.85rem" }} className="text-muted fw-bold text-capitalize">
                            {label}
                        </span>
                    </div>
                ),
            },
            // 🚀 ARQUITECTURA VISUAL: Renderizado personalizado del evento interno
            event: ({ event }) => {
                const startTime = moment(event.start).format("HH:mm");
                const endTime = moment(event.end).format("HH:mm");
                const hasActiveFilters = selectedTags.length > 0;

                return (
                    <div className="d-flex flex-column h-100 p-1 overflow-hidden" style={{ lineHeight: "1.2" }}>
                        {/* Título */}
                        <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem" }}>
                            {event.title}
                        </div>

                        {/* Rango de Hora */}
                        <div className="text-truncate opacity-75 mb-1 d-flex align-items-center gap-1 mt-1" style={{ fontSize: "0.7rem" }}>
                            <IconClock size={12} />
                            <span>
                                {startTime} - {endTime}
                            </span>
                        </div>

                        {/* Etiquetas (Tags) */}
                        {event.tags && event.tags.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mt-auto pt-1">
                                {event.tags.map((tag) => {
                                    const isHighlighted = hasActiveFilters ? selectedTags.includes(tag.id) : true;

                                    // 🚀 DESIGN SYSTEM: Contraste inteligente sobre el fondo de color del evento
                                    const badgeClasses = isHighlighted ? `bg-white text-${tag.color || "primary"} shadow-sm` : `bg-transparent border border-white text-white opacity-50`;

                                    return (
                                        <span key={tag.id} className={`badge ${badgeClasses}`} style={{ fontSize: "0.6rem", padding: "0.2rem 0.4rem" }} title={tag.name}>
                                            {tag.name}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            },
            dateCellWrapper: (props) => {
                const isMonday = moment(props.value).isoWeekday() === 1;
                const weekNumber = moment(props.value).isoWeek();

                if (!isMonday) return props.children;

                return React.cloneElement(props.children, { className: `${props.children.props.className} position-relative` }, [
                    <div
                        key="week-column"
                        className="d-flex align-items-center justify-content-center bg-light border-end"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "26px",
                            cursor: "pointer",
                            zIndex: 4,
                            transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.className = "d-flex align-items-center justify-content-center bg-primary-lt border-end")}
                        onMouseLeave={(e) => (e.currentTarget.className = "d-flex align-items-center justify-content-center bg-light border-end")}
                        // 🚀 CORRECCIÓN CRÍTICA: Detenemos el MouseDown para evitar que la librería inicie la selección de celda
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // 🚀 Detenemos el clic estándar
                            if (onWeekClick) onWeekClick(weekNumber, props.value);
                        }}
                        title={`Configurar Semana ${weekNumber}`}
                    >
                        <span className="text-muted fw-bold" style={{ fontSize: "0.75rem", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                            S. {weekNumber}
                        </span>
                    </div>,
                    props.children.props.children,
                ]);
            },
        }),
        [onWeekClick, selectedTags],
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
                    marginLeft: moment(event.start).isoWeekday() === 1 ? "26px" : "0px",
                },
            })}
        />
    );
};
