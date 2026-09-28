import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import esLocale from "@fullcalendar/core/locales/es";
import { IconClock } from "@tabler/icons-react";
import { Tooltip } from "@/shared/components/Tooltip/Tooltip";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

export const CalendarView = ({ events = [], onDateSelect, onEventClick }) => {
    // Detectamos si es una pantalla móvil (menor a 768px, estándar de Bootstrap/Tabler)
    const isMobile = useMediaQuery("(max-width: 767px)");

    // Función que personaliza la apariencia interna de cada evento en el calendario
    const renderEventContent = (eventInfo) => {
        // En la vista de lista (listPlugin), FullCalendar renderiza los eventos diferente.
        // Si estamos en la vista de lista, dejamos que FullCalendar use su diseño nativo de fila,
        // de lo contrario aplicamos nuestro diseño de tarjeta para el Grid.
        if (eventInfo.view.type.includes("list")) {
            return (
                <div className="d-flex flex-column" style={{ cursor: "pointer" }}>
                    <strong>{eventInfo.event.title}</strong>

                    {eventInfo.event.extendedProps?.description && (
                        <span className="text-muted" style={{ fontSize: "0.80rem" }}>
                            {eventInfo.event.extendedProps.description}
                        </span>
                    )}
                </div>
            );
        }

        const { event, timeText } = eventInfo;
        const description = event.extendedProps?.description || "Sin descripción adicional.";
        const tags = event.extendedProps?.tags || [];

        const tooltipContent = (
            <div className="text-start p-1" style={{ fontSize: "0.80rem" }}>
                <strong>{event.title}</strong>

                {description && (
                    <>
                        <hr className="my-1 border-secondary opacity-25" />
                        <span className="opacity-75">{description}</span>
                    </>
                )}
            </div>
        );

        return (
            <Tooltip content={tooltipContent} placement="top">
                <div className="d-flex flex-column p-1 w-100 overflow-hidden" style={{ cursor: "pointer" }}>
                    {/* 1. Hora del evento (Solo se muestra si no es "Todo el día" y FullCalendar genera el timeText) */}
                    {timeText && (
                        <span className="d-flex align-items-center text-truncate opacity-75" style={{ fontSize: "0.70rem", fontWeight: "600" }}>
                            <IconClock size={12} className="me-1 flex-shrink-0" />

                            <span className="text-truncate">{timeText}</span>
                        </span>
                    )}

                    {/* 2. Título principal del evento */}
                    <span className="font-weight-bold text-truncate mt-1" style={{ fontSize: "0.85rem", lineHeight: "1.2" }}>
                        {event.title}
                    </span>

                    {/* Descripción truncada visible en el bloque */}
                    {/* {description && (
                        <span className="text-truncate mt-1 opacity-75" style={{ fontSize: "0.70rem", fontStyle: "italic" }}>
                            {description}
                        </span>
                    )} */}

                    {/* 3. Etiquetas (Tags) inferiores heredadas de nuestro Adapter */}
                    {tags.length > 0 && (
                        <div className="d-flex flex-wrap gap-1 mt-1">
                            {tags.map((tag) => (
                                <span key={tag.id} className={`badge bg-${tag.color || "secondary"} text-white`} style={{ fontSize: "0.60rem", padding: "0.15rem 0.3rem" }}>
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Tooltip>
        );
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-3">
                <FullCalendar
                    // La propiedad 'key' fuerza a React a remontar el calendario si cambia de dispositivo
                    // Esto evita bugs de renderizado de FullCalendar al cambiar de vista drásticamente
                    key={isMobile ? "mobile" : "desktop"}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    // Asignamos la vista inicial dinámicamente
                    initialView={isMobile ? "listMonth" : "dayGridMonth"}
                    locale={esLocale}
                    // Adaptamos la botonera para que no se desborde en pantallas pequeñas
                    headerToolbar={{
                        left: "prev,next",
                        center: "title",
                        right: isMobile ? "listMonth,timeGridDay" : "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    editable={true}
                    selectable={true}
                    select={onDateSelect}
                    eventClick={onEventClick}
                    events={events}
                    height="auto"
                    eventContent={renderEventContent}
                    dayMaxEvents={true}
                    displayEventEnd={true}
                    eventTimeFormat={{
                        hour: "2-digit",
                        minute: "2-digit",
                        meridiem: false,
                        hour12: false,
                    }}
                    weekNumbers={true}
                    firstDay={1}
                    weekNumberCalculation="ISO"
                    weekNumberContent={(arg) => {
                        return `Sem. ${arg.num}`;
                    }}
                />
            </div>
        </div>
    );
};
