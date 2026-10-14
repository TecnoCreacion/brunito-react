export const plannerCalendarAdapter = (rawPlanner) => {
    // 1. Procesamos las etiquetas protegiendo a React de posibles valores nulos
    const tags = Array.isArray(rawPlanner.tags)
        ? rawPlanner.tags.map((tag) => ({
              id: tag.id,
              name: tag.name,
              color: tag.color || "primary",
          }))
        : [];

    // ⚠️ DEUDA TÉCNICA ACEPTADA TEMPORALMENTE:
    // Determinar si algo está "cancelado" basado en el texto de una etiqueta rompe la Regla 3.
    // Laravel debería enviar un campo booleano 'is_cancelled' o resolver el color desde el backend.
    const isCancelled = tags.some((tag) => tag.name.toLowerCase() === "cancelada");
    const isImportant = tags.some((tag) => tag.name.toLowerCase() === "importante");

    // Utilizamos variables semánticas de Tabler UI en lugar de HEX estáticos
    let eventColor = rawPlanner.color_theme || "primary";
    if (isCancelled) eventColor = "secondary"; // Gris
    if (isImportant) eventColor = "danger"; // Rojo

    return {
        id: rawPlanner.id,
        title: rawPlanner.title,

        // 🚀 CORRECCIÓN CRÍTICA: react-big-calendar exige objetos Date nativos
        start: new Date(rawPlanner.start_date),
        end: rawPlanner.end_date ? new Date(rawPlanner.end_date) : new Date(rawPlanner.start_date),

        allDay: rawPlanner.all_day === 1 || rawPlanner.all_day === true,

        // 🚀 NUEVA ARQUITECTURA: Mapeo de la llave foránea para las columnas de recursos
        resourceId: rawPlanner.planner_resource_id,

        // Propiedad visual limpia para el eventPropGetter
        color: eventColor,

        // Mantenemos la información original encapsulada para cuando el usuario haga clic (Modal)
        extendedProps: {
            description: rawPlanner.description || "",
            status: rawPlanner.status || "pending",
            tags: tags,
            // Conservamos los strings ISO originales por si tu formulario de edición los requiere
            originalStart: rawPlanner.start_date,
            originalEnd: rawPlanner.end_date,
            originalResourceId: rawPlanner.planner_resource_id,
        },
    };
};

export const plannerListAdapter = (rawList) => {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(plannerCalendarAdapter);
};
