export const plannerAdapter = (rawPlanner) => {
    // Procesamos las etiquetas (tags) si vienen desde la relación de Laravel
    const tags = rawPlanner.tags
        ? rawPlanner.tags.map((tag) => ({
              id: tag.id,
              name: tag.name,
              color: tag.color || "primary",
          }))
        : [];

    // Reglas visuales basadas en etiquetas o estados del negocio
    const isCancelled = tags.some((tag) => tag.name.toLowerCase() === "cancelada");
    const isImportant = tags.some((tag) => tag.name.toLowerCase() === "importante");

    let backgroundColor = "#206bc4"; // Color primario por defecto (Tabler Blue)
    if (isCancelled) backgroundColor = "#6c757d"; // Gris
    if (isImportant) backgroundColor = "#d63939"; // Rojo

    return {
        id: rawPlanner.id,
        title: rawPlanner.title,
        start: rawPlanner.start_date, // Transformamos snake_case a formato estándar de FullCalendar
        end: rawPlanner.end_date,
        allDay: rawPlanner.all_day ?? false,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        extendedProps: {
            description: rawPlanner.description || "",
            status: rawPlanner.status || "pending",
            tags: tags,

            // Fechas intactas, tal cual vienen de Laravel (ej: "2026-08-11 10:00:00")
            originalStart: rawPlanner.start_date,
            originalEnd: rawPlanner.end_date,
        },
    };
};

export const plannerListAdapter = (rawList) => {
    if (!Array.isArray(rawList)) return [];

    return rawList.map(plannerAdapter);
};
