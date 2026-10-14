import { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/es";

export const MiniCalendarPicker = ({ selectedDate, onChange }) => {
    // Estado interno para saber qué mes estamos "viendo" (puede ser distinto al mes de la fecha seleccionada)
    const [viewDate, setViewDate] = useState(moment(selectedDate || new Date()));

    // Sincronizar la vista si la fecha seleccionada cambia desde el exterior (ej. botones 'Hoy', 'Sig' del calendario principal)
    useEffect(() => {
        if (selectedDate) {
            setViewDate(moment(selectedDate));
        }
    }, [selectedDate]);

    const handlePrevMonth = () => setViewDate(viewDate.clone().subtract(1, "month"));
    const handleNextMonth = () => setViewDate(viewDate.clone().add(1, "month"));

    const handleDayClick = (day) => {
        if (onChange) onChange(day.toDate());
    };

    // Función pura para generar la cuadrícula de días del mes visible
    const generateGrid = () => {
        const startOfMonth = viewDate.clone().startOf("month");
        const startOfWeek = startOfMonth.clone().startOf("week"); // En locale 'es', la semana inicia en Lunes
        const endOfMonth = viewDate.clone().endOf("month");
        const endOfWeek = endOfMonth.clone().endOf("week");

        const days = [];
        let day = startOfWeek.clone();

        while (day.isBefore(endOfWeek, "day") || day.isSame(endOfWeek, "day")) {
            days.push(day.clone());
            day.add(1, "day");
        }
        return days;
    };

    const gridDays = generateGrid();
    const weekDays = moment.weekdaysMin(true); // Array: ["lu", "ma", "mi", "ju", "vi", "sá", "do"]

    return (
        <div className="mini-calendar">
            {/* Cabecera de Navegación */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <button className="btn btn-sm btn-icon btn-ghost-secondary" onClick={handlePrevMonth} title="Mes anterior">
                    <i className="ti ti-chevron-left"></i>
                </button>
                <span className="fw-bold text-capitalize" style={{ fontSize: "0.9rem" }}>
                    {viewDate.format("MMMM YYYY")}
                </span>
                <button className="btn btn-sm btn-icon btn-ghost-secondary" onClick={handleNextMonth} title="Mes siguiente">
                    <i className="ti ti-chevron-right"></i>
                </button>
            </div>

            {/* Cuadrícula de Días */}
            <div className="table-responsive">
                <table className="table table-sm table-borderless text-center mb-0 w-100">
                    <thead>
                        <tr>
                            {weekDays.map((wd, i) => (
                                <th key={i} className="text-muted small p-1 fw-normal text-capitalize">
                                    {wd}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Dividimos el array de días en filas de 7 (semanas) */}
                        {Array.from({ length: gridDays.length / 7 }).map((_, weekIndex) => (
                            <tr key={weekIndex}>
                                {gridDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                                    const isCurrentMonth = day.isSame(viewDate, "month");
                                    const isSelected = day.isSame(moment(selectedDate), "day");
                                    const isToday = day.isSame(moment(), "day");

                                    // Lógica de clases corporativas Tabler UI
                                    let dayClass = "rounded cursor-pointer d-flex align-items-center justify-content-center mx-auto ";
                                    if (isSelected) {
                                        dayClass += "bg-primary text-white fw-bold shadow-sm";
                                    } else if (isToday) {
                                        dayClass += "bg-primary-lt fw-bold text-primary"; // .bg-primary-lt es nativo de Tabler
                                    } else if (!isCurrentMonth) {
                                        dayClass += "text-muted opacity-50";
                                    } else {
                                        dayClass += "text-body hover-bg-light";
                                    }

                                    return (
                                        <td key={dayIndex} className="p-0">
                                            <div className={dayClass} style={{ width: "28px", height: "28px", fontSize: "0.85rem", transition: "all 0.2s" }} onClick={() => handleDayClick(day)}>
                                                {day.format("D")}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
