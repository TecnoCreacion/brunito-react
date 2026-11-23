import moment from "moment/min/moment-with-locales";
import { IconCalendarEvent, IconClock, IconTag, IconAlignLeft, IconPencil } from "@tabler/icons-react";
import { Button } from "@/shared/components/Button";

/**
 * 🚀 CAPA 2: MODAL DE RESUMEN (SOLO LECTURA)
 * Muestra los detalles completos de un recordatorio sin mutar estado.
 */
export const EventSummaryModal = ({ isOpen, event, onClose, onEdit }) => {
    if (!isOpen || !event) return null;

    const startMoment = moment(event.start);
    const endMoment = moment(event.end || event.start);
    const isSameDay = startMoment.isSame(endMoment, "day");

    const dateLabel = isSameDay ? startMoment.format("dddd D [de] MMMM, YYYY") : `${startMoment.format("D [de] MMM")} - ${endMoment.format("D [de] MMM, YYYY")}`;

    const timeLabel = event.allDay ? "Todo el día" : `${startMoment.format("HH:mm")} - ${endMoment.format("HH:mm")} hrs`;

    const eventTags = event.tags || [];
    const themeColor = event.color || "primary";

    const handleEditClick = () => {
        onClose();
        if (onEdit) onEdit(event.id);
    };

    return (
        <div className="modal modal-blur fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content shadow-lg border-0">
                    {/* Barra superior temática según color del evento */}
                    <div className={`modal-status bg-${themeColor}`} />

                    <div className="modal-header">
                        <div className="d-flex align-items-center gap-2 min-w-0">
                            <span className={`avatar avatar-sm bg-${themeColor}-lt text-${themeColor}`}>
                                <IconCalendarEvent size={20} />
                            </span>
                            <h5 className="modal-title text-truncate">{event.title}</h5>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
                    </div>

                    <div className="modal-body">
                        {/* Bloque Fecha y Horario */}
                        <div className="card bg-light-lt border-0 mb-3">
                            <div className="card-body p-3 d-flex flex-column gap-2">
                                <div className="d-flex align-items-center gap-2 text-body">
                                    <IconCalendarEvent size={18} className="text-primary flex-shrink-0" />
                                    <span className="fw-medium text-capitalize">{dateLabel}</span>
                                </div>

                                <div className="d-flex align-items-center gap-2 text-secondary">
                                    <IconClock size={18} className="text-primary flex-shrink-0" />
                                    <span>{timeLabel}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bloque Descripción */}
                        <div className="mb-3">
                            <div className="d-flex align-items-center gap-1 text-muted small fw-bold text-uppercase mb-1">
                                <IconAlignLeft size={14} />
                                <span>Descripción / Notas</span>
                            </div>
                            {event.description ? (
                                <p className="text-body mb-0" style={{ whiteSpace: "pre-line" }}>
                                    {event.description}
                                </p>
                            ) : (
                                <p className="text-muted fst-italic small mb-0">Sin descripción registrada.</p>
                            )}
                        </div>

                        {/* Bloque Etiquetas */}
                        <div>
                            <div className="d-flex align-items-center gap-1 text-muted small fw-bold text-uppercase mb-2">
                                <IconTag size={14} />
                                <span>Etiquetas</span>
                            </div>
                            {eventTags.length > 0 ? (
                                <div className="d-flex flex-wrap gap-1">
                                    {eventTags.map((tag) => (
                                        <span key={tag.id} className={`badge bg-${tag.color || "secondary"}-lt`} style={{ opacity: 0.85 }}>
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-muted fst-italic small">Sin etiquetas asignadas.</span>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer bg-light d-flex justify-content-between">
                        <button type="button" className="btn btn-link link-secondary" onClick={onClose}>
                            Cerrar
                        </button>

                        {onEdit && (
                            <Button type="button" variant="primary" onClick={handleEditClick} className="d-flex align-items-center gap-1">
                                <IconPencil size={16} />
                                <span>Editar Recordatorio</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
