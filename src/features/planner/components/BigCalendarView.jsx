import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("es");
const localizer = momentLocalizer(moment);

// Agregamos controls a los props
export const BigCalendarView = ({ events = [], resources = [], controls, onEventClick, onDateSelect }) => {
    return (
        <Calendar
            localizer={localizer}
            events={events}
            resources={resources.length > 0 ? resources : null}
            // 🚀 ARQUITECTURA: Calendario Controlado (Recibe su estado de afuera)
            date={controls.currentDate}
            view={controls.currentView}
            onNavigate={controls.changeDate}
            onView={controls.changeView}
            // 🚀 APAGAMOS LA CABECERA NATIVA
            toolbar={false}
            step={30}
            showMultiDayTimes
            selectable
            onSelectEvent={(event) => onEventClick && onEventClick(event.id)}
            onSelectSlot={(slotInfo) => onDateSelect && onDateSelect(slotInfo)}
            eventPropGetter={(event) => ({
                style: {
                    backgroundColor: `var(--tblr-${event.color || "primary"})`,
                    borderColor: `var(--tblr-${event.color || "primary"})`,
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "0.8rem",
                },
            })}
        />
    );
};
