// Util local para parsear fechas de Laravel de forma segura (Compatible con Safari y Timezones)
const parseLaravelDate = (dateString) => {
    if (!dateString) return new Date();
    if (dateString instanceof Date) return dateString;

    // Reemplaza el espacio por 'T' para cumplir el estándar ISO 8601 y evitar 'Invalid Date' en Safari
    const isoString = String(dateString).replace(" ", "T");
    // Si la fecha viene sin hora (ej: "2026-10-15"), agregamos la hora local para evitar el salto de día por timezone
    const safeString = isoString.includes("T") ? isoString : `${isoString}T00:00:00`;
    return new Date(safeString);
};

export const plannerCalendarAdapter = (rawResponse) => {
    if (!rawResponse) return null;

    // Desenvolvemos automáticamente si viene envuelto en ApiResponse::success({ success, data, message })
    const rawPlanner = rawResponse.data && typeof rawResponse.data === "object" && !Array.isArray(rawResponse.data) ? rawResponse.data : rawResponse;

    if (!rawPlanner || !rawPlanner.id) return null;

    // 1. Procesamos las etiquetas protegiendo a React de valores nulos o strings puros
    const tags = Array.isArray(rawPlanner.tags)
        ? rawPlanner.tags.map((tag) => {
              if (typeof tag === "string") {
                  return { id: tag.toLowerCase(), name: tag, color: "primary" };
              }
              return {
                  id: tag.id,
                  name: tag.name,
                  color: tag.color || "primary",
              };
          })
        : [];

    // ⚠️ DEUDA TÉCNICA ACEPTADA TEMPORALMENTE (Capítulo 11):
    // Idealmente Laravel resolverá el color o estado booleano desde el backend.
    const isCancelled = tags.some((tag) => tag.name.toLowerCase() === "cancelada");
    const isImportant = tags.some((tag) => tag.name.toLowerCase() === "importante");

    let eventColor = rawPlanner.color_theme || "primary";
    if (isCancelled) eventColor = "secondary";
    if (isImportant) eventColor = "danger";

    return {
        id: rawPlanner.id,
        title: rawPlanner.title || "",

        start: parseLaravelDate(rawPlanner.start_date),
        end: rawPlanner.end_date ? parseLaravelDate(rawPlanner.end_date) : parseLaravelDate(rawPlanner.start_date),

        allDay: rawPlanner.all_day === 1 || rawPlanner.all_day === true,
        resourceId: rawPlanner.planner_resource_id ?? null,
        color: eventColor,

        // Exponemos tags en el nivel raíz para que los componentes presentacionales no dependan de extendedProps
        tags,

        extendedProps: {
            description: rawPlanner.description || "",
            status: rawPlanner.status ?? true,
            tags,
            originalStart: rawPlanner.start_date,
            originalEnd: rawPlanner.end_date,
            originalResourceId: rawPlanner.planner_resource_id ?? null,
        },
    };
};

export const plannerListAdapter = (rawList) => {
    // Soporta tanto array directo como respuesta envuelta { data: [...] }
    const list = Array.isArray(rawList) ? rawList : Array.isArray(rawList?.data) ? rawList.data : [];
    return list.map(plannerCalendarAdapter).filter(Boolean);
};
