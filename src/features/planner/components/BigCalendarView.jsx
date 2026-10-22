import React, { useMemo, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment/min/moment-with-locales";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export const BigCalendarView = ({ events = [], resources = [], controls = {}, onEventClick, onDateSelect, onWeekClick }) => {
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
        [onWeekClick],
    );

    return (
        <Calendar
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
