import React, { useMemo, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment/min/moment-with-locales";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./BigCalendarView.css";
import { IconClock, IconCalendarEvent } from "@tabler/icons-react";

const localizer = momentLocalizer(moment);

/**
 * 🚀 CAPA 2: COMPONENTE PRESENTACIONAL DE CALENDARIO
 * Garantiza un máximo determinista de eventos por día en vista mensual (2 por defecto),
 * renderiza el botón "+ N más" con altura automática por semana y muestra "Sin etiquetas" cuando corresponde.
 */
export const BigCalendarView = ({ events = [], resources = [], controls = {}, selectedTags = [], onEventClick, onDateSelect, onWeekClick }) => {
    const {
        currentDate = new Date(),
        currentView = "month",
        changeDate = () => {},
        changeView = () => {},
        currentLocale = "es",
        maxEvents = 2, // Máximo de 2 ítems visibles por defecto (0 = sin límite)
    } = controls;

    const normalizedLocale = String(currentLocale).toLowerCase();
    const numericLimit = Number(maxEvents);
    const isUnlimited = numericLimit === 0;

    // Responsividad: detecta dispositivo móvil (< 768px)
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Vista inicial en móviles = Agenda
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

    // 🚀 COLAPSO DETERMINISTA POR DÍA EN VISTA MENSUAL
    // Muestra exactamente 'maxEvents' ítems y reemplaza el excedente por "+ N más"
    const visibleEvents = useMemo(() => {
        if (currentView !== "month" || isUnlimited || !Array.isArray(events)) {
            return events;
        }

        const eventsByDay = new Map();

        // Agrupamos eventos por fecha de inicio (YYYY-MM-DD)
        events.forEach((event) => {
            const dayKey = moment(event.start).format("YYYY-MM-DD");
            if (!eventsByDay.has(dayKey)) {
                eventsByDay.set(dayKey, []);
            }
            eventsByDay.get(dayKey).push(event);
        });

        const result = [];

        eventsByDay.forEach((dayEvents, dayKey) => {
            // Ordenamos cronológicamente los eventos del día
            const sorted = [...dayEvents].sort((a, b) => new Date(a.start) - new Date(b.start));

            if (sorted.length <= numericLimit) {
                result.push(...sorted);
            } else {
                // 1. Tomamos exactamente los N eventos permitidos (ej. 2)
                const visibleSlice = sorted.slice(0, numericLimit);
                const hiddenCount = sorted.length - numericLimit;
                const lastVisibleEvent = visibleSlice[visibleSlice.length - 1];

                result.push(...visibleSlice);

                // 2. Agregamos el botón interactivo "+ N más" al final de ese día
                const showMoreStart = moment(lastVisibleEvent.end || dayKey).toDate();
                result.push({
                    id: `show-more-${dayKey}`,
                    title: `+ ${hiddenCount} más`,
                    start: showMoreStart,
                    end: showMoreStart,
                    isShowMoreTrigger: true,
                    targetDate: moment(dayKey, "YYYY-MM-DD").toDate(),
                });
            }
        });

        return result;
    }, [events, currentView, isUnlimited, numericLimit]);

    // Clave reactiva para ajustar la cuadrícula al cambiar de mes o vista
    const calendarGridKey = `${moment(currentDate).format("YYYY-MM")}-${currentView}`;

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

            // 1. Renderizado de Eventos y Botón "+ N más" en Vista Mes/Semana
            event: ({ event }) => {
                // Renderizado especial para el disparador "+ N más"
                if (event.isShowMoreTrigger) {
                    return (
                        <div className="text-center w-100" style={{ fontSize: "0.74rem", lineHeight: "1.2" }}>
                            {event.title}
                        </div>
                    );
                }

                const startTime = moment(event.start).format("HH:mm");
                const endTime = moment(event.end).format("HH:mm");
                const hasActiveFilters = selectedTags.length > 0;
                const eventTags = event.tags || event.extendedProps?.tags || [];

                return (
                    <div className="d-flex flex-column h-100 p-1 overflow-hidden" style={{ lineHeight: "1.15" }}>
                        <div className="fw-bold text-truncate" style={{ fontSize: "0.8rem" }}>
                            {event.title}
                        </div>

                        <div className="text-truncate opacity-75 d-flex align-items-center gap-1" style={{ fontSize: "0.68rem", marginTop: "2px" }}>
                            <IconClock size={11} />
                            <span>
                                {startTime} - {endTime}
                            </span>
                        </div>

                        <div className="d-flex flex-wrap gap-1 mt-1 pt-1">
                            {eventTags.length > 0 ? (
                                eventTags.map((tag) => {
                                    const isHighlighted = hasActiveFilters ? selectedTags.includes(tag.id) : true;
                                    const badgeClasses = isHighlighted ? `bg-white text-${tag.color || "primary"} shadow-sm` : `bg-transparent border border-white text-white opacity-50`;

                                    return (
                                        <span key={tag.id} className={`badge ${badgeClasses}`} style={{ fontSize: "0.58rem", padding: "0.1rem 0.3rem" }}>
                                            {tag.name}
                                        </span>
                                    );
                                })
                            ) : (
                                <span className="opacity-75 fst-italic" style={{ fontSize: "0.62rem" }}>
                                    Sin etiquetas
                                </span>
                            )}
                        </div>
                    </div>
                );
            },

            // 2. Pestaña lateral táctil para selección de semanas completas
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

            // 3. Vista Agenda Tipo Línea de Tiempo (Timeline)
            agenda: {
                date: ({ label }) => (
                    <div className="py-2 border-bottom fw-bold text-primary text-capitalize d-flex align-items-center gap-2">
                        <IconCalendarEvent size={18} />
                        <span>{label}</span>
                    </div>
                ),
                time: ({ event }) => {
                    const startTime = moment(event.start).format("HH:mm");
                    const endTime = moment(event.end).format("HH:mm");
                    return (
                        <div className="d-flex align-items-center justify-content-center h-100 pe-3">
                            <span className="badge bg-primary-lt text-primary px-2 py-1 rounded-pill d-flex align-items-center gap-1 font-monospace" style={{ fontSize: "0.75rem" }}>
                                <IconClock size={12} />
                                {startTime} - {endTime}
                            </span>
                        </div>
                    );
                },
                event: ({ event }) => {
                    const eventTags = event.tags || event.extendedProps?.tags || [];

                    return (
                        <div className="card shadow-sm border-0 border-start border-3 my-1 cursor-pointer transition-base hover-shadow-md" style={{ borderColor: `var(--tblr-${event.color || "primary"})` }} onClick={() => onEventClick && onEventClick(event.id)}>
                            <div className="card-body p-2">
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                    <h4 className="card-title h5 m-0 text-truncate">{event.title}</h4>
                                    {eventTags.length > 0 ? (
                                        <div className="d-flex gap-1">
                                            {eventTags.map((tag) => (
                                                <span key={tag.id} className={`badge bg-${tag.color || "secondary"}-lt`} style={{ fontSize: "0.65rem" }}>
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-muted fst-italic" style={{ fontSize: "0.7rem" }}>
                                            Sin etiquetas
                                        </span>
                                    )}
                                </div>
                                {event.description && (
                                    <p className="text-secondary small mb-0 text-truncate-2" style={{ fontSize: "0.8rem" }}>
                                        {event.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                },
            },
        }),
        [onWeekClick, selectedTags, currentView, onEventClick],
    );

    // Manejador unificado: si hace clic en "+ N más", abre vista Diaria; si es evento, abre detalle
    const handleSelectEvent = (event) => {
        if (event.isShowMoreTrigger) {
            changeDate(event.targetDate);
            changeView("day");
            return;
        }
        if (onEventClick) {
            onEventClick(event.id);
        }
    };

    return (
        <div className="planner-calendar-container position-relative">
            <Calendar
                key={calendarGridKey}
                className="pb-1"
                localizer={localizer}
                events={visibleEvents}
                // 🚀 Al controlar el slice de forma determinista, showAllEvents={true} evita que react-big-calendar oculte tarjetas en overflow
                showAllEvents={true}
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
                onSelectEvent={handleSelectEvent}
                onSelectSlot={(slotInfo) => onDateSelect && onDateSelect(slotInfo)}
                components={customComponents}
                eventPropGetter={(event) => {
                    const isMondayInMonth = currentView === "month" && moment(event.start).isoWeekday() === 1;

                    if (event.isShowMoreTrigger) {
                        return {
                            className: "planner-show-more-event",
                            style: {
                                borderRadius: "4px",
                                marginLeft: isMondayInMonth ? "24px" : "0px",
                            },
                        };
                    }

                    return {
                        style: {
                            backgroundColor: `var(--tblr-${event.color || "primary"})`,
                            borderColor: `var(--tblr-${event.color || "primary"})`,
                            borderRadius: "4px",
                            color: "#fff",
                            fontSize: "0.8rem",
                            marginLeft: isMondayInMonth ? "24px" : "0px",
                        },
                    };
                }}
            />
        </div>
    );
};
