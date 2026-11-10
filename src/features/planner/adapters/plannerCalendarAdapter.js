// util local para parsear fechas de Laravel de forma segura (Compatible con Safari y Timezones)
const parseLaravelDate = (dateString) => {
    if (!dateString) return new Date();
    // Reemplaza el espacio por 'T' para cumplir el estándar ISO 8601 y evitar 'Invalid Date' en Safari
    const isoString = dateString.replace(" ", "T");
    // Si la fecha viene sin hora (ej: "2026-10-15"), agregamos la hora local para evitar el salto de día por timezone
    const safeString = isoString.includes("T") ? isoString : `${isoString}T00:00:00`;
    return new Date(safeString);
};

export const plannerCalendarAdapter = (rawPlanner) => {
    // 1. Procesamos las etiquetas protegiendo a React de valores nulos o strings puros
    const tags = Array.isArray(rawPlanner.tags)
        ? rawPlanner.tags.map((tag) => {
              // Manejo defensivo: si Laravel envía un arreglo de strings
              if (typeof tag === "string") {
                  return { id: tag.toLowerCase(), name: tag, color: "primary" };
              }
              // Manejo estándar: si Laravel envía la relación como objetos
              return {
                  id: tag.id,
                  name: tag.name,
                  color: tag.color || "primary",
              };
          })
        : [];

    // ⚠️ DEUDA TÉCNICA ACEPTADA TEMPORALMENTE:
    // Determinar si algo está "cancelado" basado en el texto de una etiqueta rompe la Regla 3.
    // Laravel debería enviar un campo booleano 'is_cancelled' o resolver el color desde el backend[cite: 7].
    const isCancelled = tags.some((tag) => tag.name.toLowerCase() === "cancelada");
    const isImportant = tags.some((tag) => tag.name.toLowerCase() === "importante");

    // Utilizamos variables semánticas de Tabler UI en lugar de HEX estáticos
    let eventColor = rawPlanner.color_theme || "primary";
    if (isCancelled) eventColor = "secondary"; // Gris
    if (isImportant) eventColor = "danger"; // Rojo

    return {
        id: rawPlanner.id,
        title: rawPlanner.title,

        // 🚀 CORRECCIÓN CRÍTICA: Parseo seguro para evitar bugs de zona horaria y Safari
        start: parseLaravelDate(rawPlanner.start_date),
        end: rawPlanner.end_date ? parseLaravelDate(rawPlanner.end_date) : parseLaravelDate(rawPlanner.start_date),

        allDay: rawPlanner.all_day === 1 || rawPlanner.all_day === true,

        // Mapeo de la llave foránea para las columnas de recursos
        resourceId: rawPlanner.planner_resource_id,

        // Propiedad visual limpia para el eventPropGetter
        color: eventColor,

        // Mantenemos la información original encapsulada para cuando el usuario haga clic (Modal)
        extendedProps: {
            description: rawPlanner.description || "",
            status: rawPlanner.status || "pending",
            tags: tags, // Ahora siempre es un array de objetos consistente
            // Conservamos los strings originales de Laravel para el envío de formularios (Capa 10)[cite: 7]
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
