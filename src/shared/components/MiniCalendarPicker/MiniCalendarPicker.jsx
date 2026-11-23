import { useState, useEffect, useMemo } from "react";
import moment from "moment/min/moment-with-locales";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export const MiniCalendarPicker = ({ selectedDate, onChange, locale = "es" }) => {
    const normalizedLocale = String(locale).toLowerCase();

    // Estado interno para el mes visualizado (independiente del mes de selectedDate)
    const [viewDate, setViewDate] = useState(() => moment(selectedDate || new Date()).locale(normalizedLocale));

    // Sincronizar si selectedDate o el locale cambian desde el exterior
    useEffect(() => {
        if (selectedDate) {
            setViewDate(moment(selectedDate).locale(normalizedLocale));
        }
    }, [selectedDate, normalizedLocale]);

    const handlePrevMonth = () => setViewDate((prev) => prev.clone().subtract(1, "month"));
    const handleNextMonth = () => setViewDate((prev) => prev.clone().add(1, "month"));

    const handleDayClick = (day) => {
        if (onChange) onChange(day.toDate());
    };

    // 🚀 ESTANDARIZACIÓN ISO: startOf("isoWeek") y endOf("isoWeek") garantizan
    // que la cuadrícula SIEMPRE comience en Lunes y termine en Domingo desde el primer render.
    const gridDays = useMemo(() => {
        const localizedView = viewDate.clone().locale(normalizedLocale);
        const startOfMonth = localizedView.clone().startOf("month");
        const startOfWeek = startOfMonth.clone().startOf("isoWeek");
        const endOfMonth = localizedView.clone().endOf("month");
        const endOfWeek = endOfMonth.clone().endOf("isoWeek");

        const days = [];
        let cursor = startOfWeek.clone();

        while (cursor.isBefore(endOfWeek, "day") || cursor.isSame(endOfWeek, "day")) {
            days.push(cursor.clone());
            cursor.add(1, "day");
        }

        return days;
    }, [viewDate, normalizedLocale]);

    // Generamos los 7 encabezados alineados exactamente con el lunes (isoWeek)
    const weekDays = useMemo(() => {
        const monday = moment().locale(normalizedLocale).startOf("isoWeek");
        return Array.from({ length: 7 }, (_, idx) => monday.clone().add(idx, "days").format("dd"));
    }, [normalizedLocale]);

    return (
        <div className="mini-calendar">
            {/* Cabecera de Navegación */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <button type="button" className="btn btn-sm btn-icon btn-ghost-secondary" onClick={handlePrevMonth} title="Mes anterior" aria-label="Mes anterior">
                    <IconChevronLeft size={16} />
                </button>

                <span className="fw-bold text-capitalize" style={{ fontSize: "0.9rem" }}>
                    {viewDate.clone().locale(normalizedLocale).format("MMMM YYYY")}
                </span>

                <button type="button" className="btn btn-sm btn-icon btn-ghost-secondary" onClick={handleNextMonth} title="Mes siguiente" aria-label="Mes siguiente">
                    <IconChevronRight size={16} />
                </button>
            </div>

            {/* Cuadrícula de Días (Lunes a Domingo) */}
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
                        {Array.from({ length: gridDays.length / 7 }).map((_, weekIndex) => (
                            <tr key={weekIndex}>
                                {gridDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                                    const isCurrentMonth = day.isSame(viewDate, "month");
                                    const isSelected = selectedDate ? day.isSame(moment(selectedDate), "day") : false;
                                    const isToday = day.isSame(moment(), "day");

                                    let dayClass = "rounded cursor-pointer d-flex align-items-center justify-content-center mx-auto ";
                                    if (isSelected) {
                                        dayClass += "bg-primary text-white fw-bold shadow-sm";
                                    } else if (isToday) {
                                        dayClass += "bg-primary-lt fw-bold text-primary";
                                    } else if (!isCurrentMonth) {
                                        dayClass += "text-muted opacity-50";
                                    } else {
                                        dayClass += "text-body hover-bg-light";
                                    }

                                    return (
                                        <td key={dayIndex} className="p-0">
                                            <div
                                                className={dayClass}
                                                style={{ width: "28px", height: "28px", fontSize: "0.85rem", transition: "all 0.2s" }}
                                                onClick={() => handleDayClick(day)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        handleDayClick(day);
                                                    }
                                                }}
                                            >
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
