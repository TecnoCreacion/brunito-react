import moment from "moment";

export const plannerFormAdapter = (rawPlanner) => {
    // Si Laravel no entrega la data, devolvemos null
    if (!rawPlanner) return null;

    // Procesamos las fechas originales de Laravel (ej. "2026-10-14 10:00:00")
    const startMoment = rawPlanner.start_date ? moment(rawPlanner.start_date) : null;
    const endMoment = rawPlanner.end_date ? moment(rawPlanner.end_date) : null;

    return {
        id: rawPlanner.id,
        title: rawPlanner.title || "",
        description: rawPlanner.description || "",

        // 🚀 ARQUITECTURA: El formulario exige strings separados, no objetos Date
        startDate: startMoment ? startMoment.format("YYYY-MM-DD") : "",
        startTime: startMoment ? startMoment.format("HH:mm") : "",

        endDate: endMoment ? endMoment.format("YYYY-MM-DD") : "",
        endTime: endMoment ? endMoment.format("HH:mm") : "",

        // Aplanamos las etiquetas para que el hook las use fácilmente
        tags: Array.isArray(rawPlanner.tags) ? rawPlanner.tags.map((t) => t.name) : [],
    };
};
