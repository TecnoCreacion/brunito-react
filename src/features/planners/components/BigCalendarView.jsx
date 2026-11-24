import React, { useMemo, useEffect, useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment/min/moment-with-locales";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./BigCalendarView.css";
import { IconClock, IconDotsVertical } from "@tabler/icons-react";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { AgendaWeekTimeline } from "./AgendaWeekTimeline";
import { EventActionDropdown } from "./EventActionDropdown";

const localizer = momentLocalizer(moment);

const CalendarEventCard = ({ event, isMobile, selectedTags, isMenuOpen, onToggleMenu, onCloseMenu, onSummaryEvent, onEditEvent, onOrderEvent, onDeleteEvent }) => {
    const cardRef = useRef(null);
    const kebabBtnRef = useRef(null);

    const startTime = moment(event.start).format("HH:mm");
    const endTime = moment(event.end).format("HH:mm");
    const hasActiveFilters = selectedTags.length > 0;
    const eventTags = event.tags || [];
    const isTodayEvent = moment().isBetween(moment(event.start).startOf("day"), moment(event.end || event.start).endOf("day"), null, "[]");

    const handleCardClick = (e) => {
        if (!isMobile) return;
        e.stopPropagation();
        onToggleMenu(event.id);
    };

    const handleKebabClick = (e) => {
        e.stopPropagation();
        onToggleMenu(event.id);
    };

    return (
        <div
            ref={cardRef}
            className="d-flex flex-column h-100 p-1 position-relative"
            style={{
                lineHeight: "1.15",
                cursor: isMobile ? "pointer" : "default",
            }}
            onClick={handleCardClick}
        >
            <div className="d-flex align-items-start justify-content-between gap-1">
                <div className="fw-bold text-truncate" style={{ fontSize: "0.8rem" }}>
                    {event.title}
                </div>

                {!isMobile && (
                    <button ref={kebabBtnRef} type="button" className={`btn btn-link p-0 planner-event-kebab-btn ${isTodayEvent ? "text-white" : "text-reset"}`} onClick={handleKebabClick} onMouseDown={(e) => e.stopPropagation()} aria-label="Opciones del evento" aria-expanded={isMenuOpen}>
                        <IconDotsVertical size={15} />
                    </button>
                )}
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
                        const badgeClasses = isTodayEvent ? (isHighlighted ? `bg-white text-${tag.color || "primary"} shadow-sm` : "bg-transparent border border-white text-white opacity-50") : isHighlighted ? `bg-${tag.color || "primary"} text-white` : `bg-${tag.color || "secondary"}-lt text-${tag.color || "secondary"} opacity-50`;

                        return (
                            <span key={tag.id} className={`badge ${badgeClasses} planner-tag-badge ${!isHighlighted ? "planner-tag-badge--dimmed" : ""}`} style={{ fontSize: "0.58rem", padding: "0.1rem 0.3rem" }}>
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

            <EventActionDropdown event={event} isOpen={isMenuOpen} anchorRef={isMobile ? cardRef : kebabBtnRef} onClose={onCloseMenu} onSummary={onSummaryEvent} onEdit={onEditEvent} onOrder={onOrderEvent} onDelete={onDeleteEvent} />
        </div>
    );
};

export const BigCalendarView = ({ events = [], resources = [], controls = {}, selectedTags = [], onSummaryEvent, onEditEvent, onOrderEvent, onDeleteEvent, onDateSelect, onWeekClick, onReorderDayEvents }) => {
    const { currentDate = new Date(), currentView = "month", changeDate = () => {}, changeView = () => {}, currentLocale = "es", maxEvents = 2 } = controls;

    const normalizedLocale = String(currentLocale).toLowerCase();
    const numericLimit = Number(maxEvents);
    const isUnlimited = numericLimit === 0;

    const isMobile = useMediaQuery("(max-width: 767px)");
    const [openMenuEventId, setOpenMenuEventId] = useState(null);

    useEffect(() => {
        setOpenMenuEventId(null);
        if (isMobile && currentView !== "agenda") {
            changeView("agenda");
        }
    }, [isMobile]);

    useEffect(() => {
        setOpenMenuEventId(null);
    }, [currentView, currentDate]);

    useEffect(() => {
        moment.updateLocale(normalizedLocale, {
            week: {
                dow: 1,
            },
        });
        moment.locale(normalizedLocale);
    }, [normalizedLocale]);

    const visibleEvents = useMemo(() => {
        if (currentView !== "month" || isUnlimited || !Array.isArray(events)) {
            return events;
        }

        const eventsByDay = new Map();

        events.forEach((event) => {
            const dayKey = moment(event.start).format("YYYY-MM-DD");
            if (!eventsByDay.has(dayKey)) {
                eventsByDay.set(dayKey, []);
            }
            eventsByDay.get(dayKey).push(event);
        });

        const result = [];

        eventsByDay.forEach((dayEvents, dayKey) => {
            const sorted = [...dayEvents].sort((a, b) => new Date(a.start) - new Date(b.start));

            if (sorted.length <= numericLimit) {
                result.push(...sorted);
            } else {
                const visibleSlice = sorted.slice(0, numericLimit);
                const hiddenCount = sorted.length - numericLimit;
                const lastVisibleEvent = visibleSlice[visibleSlice.length - 1];

                result.push(...visibleSlice);

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

    const calendarGridKey = `${moment(currentDate).format("YYYY-MM")}-${currentView}-${isMobile ? "mobile" : "desktop"}`;

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

            event: ({ event }) => {
                if (event.isShowMoreTrigger) {
                    return (
                        <div className="text-center w-100" style={{ fontSize: "0.74rem", lineHeight: "1.2" }}>
                            {event.title}
                        </div>
                    );
                }

                return <CalendarEventCard event={event} isMobile={isMobile} selectedTags={selectedTags} isMenuOpen={openMenuEventId === event.id} onToggleMenu={(id) => setOpenMenuEventId((prev) => (prev === id ? null : id))} onCloseMenu={() => setOpenMenuEventId(null)} onSummaryEvent={onSummaryEvent} onEditEvent={onEditEvent} onOrderEvent={onOrderEvent} onDeleteEvent={onDeleteEvent} />;
            },

            dateCellWrapper: (props) => {
                const isMonday = moment(props.value).isoWeekday() === 1;
                const weekNumber = moment(props.value).isoWeek();

                if (!isMonday || currentView !== "month") return props.children;

                return React.cloneElement(props.children, { className: `${props.children.props.className} position-relative` }, [
                    <div
                        key="week-column"
                        className="planner-week-tab d-flex align-items-center justify-content-center border-end"
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
        }),
        [onWeekClick, selectedTags, currentView, isMobile, openMenuEventId, onSummaryEvent, onEditEvent, onOrderEvent, onDeleteEvent],
    );

    const handleSelectEvent = (event) => {
        if (event.isShowMoreTrigger) {
            changeDate(event.targetDate);
            changeView("day");
        }
    };

    if (currentView === "agenda") {
        return <AgendaWeekTimeline currentDate={currentDate} events={events} selectedTags={selectedTags} onSummaryEvent={onSummaryEvent} onEditEvent={onEditEvent} onOrderEvent={onOrderEvent} onDeleteEvent={onDeleteEvent} onDateSelect={onDateSelect} onReorderDayEvents={onReorderDayEvents} />;
    }

    return (
        <div className="planner-calendar-container position-relative">
            <Calendar
                key={calendarGridKey}
                className="pb-1"
                localizer={localizer}
                events={visibleEvents}
                showAllEvents={true}
                dayLayoutAlgorithm="no-overlap"
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
                    const mondayClass = isMondayInMonth ? "planner-monday-event" : "";

                    if (event.isShowMoreTrigger) {
                        return {
                            className: `planner-show-more-event ${mondayClass}`.trim(),
                            style: {
                                borderRadius: "4px",
                            },
                        };
                    }

                    const todayStart = moment().startOf("day");
                    const eventStart = moment(event.start);
                    const eventEnd = moment(event.end || event.start);

                    let temporalModifier = "planner-event--future";
                    if (todayStart.isBetween(eventStart.clone().startOf("day"), eventEnd.clone().endOf("day"), null, "[]")) {
                        temporalModifier = "planner-event--today";
                    } else if (eventEnd.isBefore(todayStart)) {
                        temporalModifier = "planner-event--past";
                    }

                    const themeColor = event.color || "primary";

                    return {
                        className: `planner-event-item ${temporalModifier} ${mondayClass}`.trim(),
                        style: {
                            "--event-color": `var(--tblr-${themeColor})`,
                            "--event-color-lt": `var(--tblr-${themeColor}-lt)`,
                        },
                    };
                }}
            />
        </div>
    );
};
