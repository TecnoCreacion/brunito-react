import { useMemo, useState, useRef } from "react";
import moment from "moment/min/moment-with-locales";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { IconClock, IconPlus, IconCalendarWeek, IconDotsVertical, IconArrowsMove } from "@tabler/icons-react";
import { EventActionDropdown } from "./EventActionDropdown";

const DAY_ACCENT_COLORS = ["info", "warning", "danger", "purple", "success", "primary", "teal"];

const AddTaskDayTrigger = ({ onClick, compact = false }) => (
    <button type="button" onClick={onClick} className={`btn btn-sm w-100 d-flex align-items-center justify-content-center gap-1 planner-add-task-btn ${compact ? "py-1 mt-1" : "py-2"}`}>
        <IconPlus size={15} />
        <span>Agregar tarea</span>
    </button>
);

const AgendaTimelineEventCard = ({ event, dayDateKey, isMobile, hasActiveFilters, selectedTags, isDayOrdering, isDragging, isDragOver, isMenuOpen, onToggleMenu, onCloseMenu, onDragStart, onDragOver, onDragEnd, onSummaryEvent, onEditEvent, onActivateOrderMode, onDeleteEvent }) => {
    const cardRef = useRef(null);
    const kebabBtnRef = useRef(null);

    const startTime = moment(event.start).format("HH:mm");
    const endTime = moment(event.end).format("HH:mm");
    const eventTags = event.tags || [];
    const canDragCard = !isMobile && isDayOrdering;

    // En móvil se abre tocando en cualquier parte del card; en escritorio solo mediante el botón de 3 puntos
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
            draggable={canDragCard}
            onDragStart={(e) => onDragStart(e, dayDateKey, event.id)}
            onDragOver={(e) => onDragOver(e, dayDateKey, event.id)}
            onDragEnd={onDragEnd}
            className={`card shadow-sm border-0 border-start border-3 position-relative planner-draggable-item ${isMobile ? "planner-mobile-card-tap" : ""} ${isDayOrdering ? "is-ordering-mode" : ""} ${isDragging ? "is-dragging" : ""} ${isDragOver ? "is-drag-over" : ""}`}
            style={{
                borderColor: `var(--tblr-${event.color || "primary"})`,
                cursor: isMobile ? "pointer" : undefined,
            }}
            onClick={handleCardClick}
        >
            <div className="card-body p-2 px-3">
                <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                    <div className="d-flex flex-wrap align-items-center gap-2 min-w-0">
                        <span className="badge bg-primary-lt text-primary px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1 font-monospace" style={{ fontSize: "0.72rem" }}>
                            <IconClock size={12} />
                            {event.allDay ? "Todo el día" : `${startTime} - ${endTime}`}
                        </span>
                        <h4 className="card-title h5 m-0 text-truncate">{event.title}</h4>
                    </div>

                    {/* Botón de 3 puntos visible SOLO en Escritorio */}
                    {!isMobile && (
                        <button ref={kebabBtnRef} type="button" className="btn btn-link text-muted p-0 planner-event-kebab-btn" onClick={handleKebabClick} onMouseDown={(e) => e.stopPropagation()} aria-label="Opciones del evento" aria-expanded={isMenuOpen}>
                            <IconDotsVertical size={18} />
                        </button>
                    )}
                </div>

                <div className="d-flex flex-wrap gap-1 mb-1">
                    {eventTags.length > 0 ? (
                        eventTags.map((tag) => {
                            const isHighlighted = hasActiveFilters ? selectedTags.includes(tag.id) : true;
                            return (
                                <span key={tag.id} className={`badge bg-${tag.color || "secondary"}-lt planner-tag-badge ${!isHighlighted ? "planner-tag-badge--dimmed" : ""}`} style={{ fontSize: "0.65rem" }}>
                                    {tag.name}
                                </span>
                            );
                        })
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

                <EventActionDropdown event={event} isOpen={isMenuOpen} anchorRef={isMobile ? cardRef : kebabBtnRef} onClose={onCloseMenu} onSummary={onSummaryEvent} onEdit={onEditEvent} onOrder={(ev) => onActivateOrderMode(ev, dayDateKey)} onDelete={onDeleteEvent} />
            </div>
        </div>
    );
};

export const AgendaWeekTimeline = ({ currentDate = new Date(), events = [], selectedTags = [], onSummaryEvent, onEditEvent, onOrderEvent, onDeleteEvent, onDateSelect, onReorderDayEvents }) => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const [openMenuEventId, setOpenMenuEventId] = useState(null);
    const [orderingDayKey, setOrderingDayKey] = useState(null);
    const [draggedState, setDraggedState] = useState({ dateKey: null, eventId: null });
    const [dragOverEventId, setDragOverEventId] = useState(null);

    const weekData = useMemo(() => {
        const baseMoment = moment(currentDate);
        const startOfWeek = baseMoment.clone().startOf("isoWeek");
        const endOfWeek = baseMoment.clone().endOf("isoWeek");
        const weekNumber = baseMoment.isoWeek();

        const days = Array.from({ length: 7 }, (_, index) => {
            const dayMoment = startOfWeek.clone().add(index, "days");
            const dateKey = dayMoment.format("YYYY-MM-DD");

            const dayEvents = (Array.isArray(events) ? events : [])
                .filter((event) => {
                    const eventStart = moment(event.start).format("YYYY-MM-DD");
                    const eventEnd = moment(event.end || event.start).format("YYYY-MM-DD");
                    return dateKey >= eventStart && dateKey <= eventEnd;
                })
                .sort((a, b) => {
                    const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
                    const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
                    if (orderA !== orderB) return orderA - orderB;
                    return new Date(a.start) - new Date(b.start);
                });

            return {
                dateKey,
                dateObject: dayMoment.toDate(),
                dayName: dayMoment.format("dddd"),
                dayNumber: dayMoment.format("DD"),
                monthShort: dayMoment.format("MMM"),
                isToday: dayMoment.isSame(moment(), "day"),
                accentColor: dayEvents[0]?.color || DAY_ACCENT_COLORS[index % DAY_ACCENT_COLORS.length],
                events: dayEvents,
            };
        });

        return {
            weekNumber,
            rangeLabel: `${startOfWeek.format("D [de] MMM")} - ${endOfWeek.format("D [de] MMM, YYYY")}`,
            days,
        };
    }, [currentDate, events]);

    const handleAddDayTask = (dateObject) => {
        if (!onDateSelect) return;
        onDateSelect({ start: dateObject, end: dateObject, action: "click" });
    };

    const handleActivateOrderMode = (event, dateKey) => {
        setOrderingDayKey(dateKey);
        if (onOrderEvent) {
            onOrderEvent(event);
        }
    };

    const handleDragStart = (e, dateKey, eventId) => {
        if (isMobile || orderingDayKey !== dateKey) {
            e.preventDefault();
            return;
        }
        setOpenMenuEventId(null);
        setDraggedState({ dateKey, eventId });
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(eventId));
    };

    const handleDragOver = (e, dateKey, targetEventId) => {
        e.preventDefault();
        if (draggedState.dateKey !== dateKey || draggedState.eventId === targetEventId) return;
        e.dataTransfer.dropEffect = "move";
        if (dragOverEventId !== targetEventId) {
            setDragOverEventId(targetEventId);
        }
    };

    const handleDrop = (e, day) => {
        e.preventDefault();
        const { dateKey, eventId } = draggedState;

        if (dateKey === day.dateKey && eventId && dragOverEventId && eventId !== dragOverEventId) {
            const currentIds = day.events.map((ev) => ev.id);
            const fromIndex = currentIds.indexOf(eventId);
            const toIndex = currentIds.indexOf(dragOverEventId);

            if (fromIndex !== -1 && toIndex !== -1) {
                const reorderedIds = [...currentIds];
                const [movedId] = reorderedIds.splice(fromIndex, 1);
                reorderedIds.splice(toIndex, 0, movedId);

                if (onReorderDayEvents) {
                    onReorderDayEvents({ dateKey: day.dateKey, orderedIds: reorderedIds });
                }
            }
        }

        setDraggedState({ dateKey: null, eventId: null });
        setDragOverEventId(null);
        setOrderingDayKey(null);
    };

    const handleDragEnd = () => {
        setDraggedState({ dateKey: null, eventId: null });
        setDragOverEventId(null);
        setOrderingDayKey(null);
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-light-lt d-flex flex-wrap align-items-center justify-content-between gap-2 py-3">
                <div className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-sm bg-primary-lt text-primary">
                        <IconCalendarWeek size={20} />
                    </span>
                    <div>
                        <h3 className="card-title m-0 fw-bold">Planificación Semanal · Semana {weekData.weekNumber}</h3>
                        <p className="text-muted small m-0 text-capitalize">{weekData.rangeLabel}</p>
                    </div>
                </div>

                {orderingDayKey ? (
                    <button type="button" className="btn btn-sm btn-warning d-flex align-items-center gap-1" onClick={() => setOrderingDayKey(null)}>
                        <IconArrowsMove size={15} />
                        <span>Finalizar orden</span>
                    </button>
                ) : (
                    <span className="badge bg-secondary-lt text-secondary">Lunes a Domingo</span>
                )}
            </div>

            <div className="card-body py-4 px-3 px-md-4">
                <div className="planner-vertical-timeline">
                    {weekData.days.map((day) => {
                        const hasEvents = day.events.length > 0;
                        const hasActiveFilters = selectedTags.length > 0;
                        const isDayOrdering = orderingDayKey === day.dateKey;

                        return (
                            <div key={day.dateKey} className="planner-timeline-item">
                                <div className={`planner-timeline-dot border-${day.accentColor} ${day.isToday ? `bg-${day.accentColor}-lt` : "bg-white"}`} />

                                <div className="planner-timeline-content">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <span className={`fw-bold text-capitalize fs-3 text-${day.accentColor}`}>
                                            {day.dayName} {day.dayNumber}
                                        </span>
                                        <span className="text-muted small text-uppercase">{day.monthShort}</span>
                                        {day.isToday && <span className={`badge bg-${day.accentColor} text-white ms-1`}>Hoy</span>}
                                        {isDayOrdering && <span className="badge bg-warning-lt text-warning ms-1">Arrastra para reordenar</span>}
                                        <div className="planner-timeline-dashed-divider flex-grow-1" />
                                    </div>

                                    <div className="d-flex flex-column gap-2" onDrop={(e) => handleDrop(e, day)}>
                                        {hasEvents &&
                                            day.events.map((event) => (
                                                <AgendaTimelineEventCard
                                                    key={event.id}
                                                    event={event}
                                                    dayDateKey={day.dateKey}
                                                    isMobile={isMobile}
                                                    hasActiveFilters={hasActiveFilters}
                                                    selectedTags={selectedTags}
                                                    isDayOrdering={isDayOrdering}
                                                    isDragging={draggedState.eventId === event.id}
                                                    isDragOver={dragOverEventId === event.id}
                                                    isMenuOpen={openMenuEventId === event.id}
                                                    onToggleMenu={(id) => setOpenMenuEventId((prev) => (prev === id ? null : id))}
                                                    onCloseMenu={() => setOpenMenuEventId(null)}
                                                    onDragStart={handleDragStart}
                                                    onDragOver={handleDragOver}
                                                    onDragEnd={handleDragEnd}
                                                    onSummaryEvent={onSummaryEvent}
                                                    onEditEvent={onEditEvent}
                                                    onActivateOrderMode={handleActivateOrderMode}
                                                    onDeleteEvent={onDeleteEvent}
                                                />
                                            ))}

                                        <AddTaskDayTrigger onClick={() => handleAddDayTask(day.dateObject)} compact={hasEvents} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
