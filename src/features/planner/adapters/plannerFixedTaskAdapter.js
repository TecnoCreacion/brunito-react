/**
 * Adapta una tarea fija individual proveniente de Laravel al modelo de Frontend.
 */
export const fixedTaskAdapter = (apiItem) => {
    if (!apiItem) return null;

    const rawRules = Array.isArray(apiItem.rules) ? apiItem.rules : [];

    let adaptedSchedules = [{ daysOfWeek: [], startTime: "", endTime: "" }];
    let adaptedMonthly = { dayOfMonth: "", requiresBusinessDay: false };
    let rotationWeek = "";

    if (apiItem.recurrence_type === "work_shift" && rawRules.length > 0) {
        adaptedSchedules = rawRules.map((rule) => ({
            daysOfWeek: Array.isArray(rule.days_of_week) ? rule.days_of_week.map(Number) : [],
            startTime: rule.start_time || "",
            endTime: rule.end_time || "",
            // Preservamos snake_case por compatibilidad con legacy props si aplica
            days_of_week: Array.isArray(rule.days_of_week) ? rule.days_of_week.map(Number) : [],
            start_time: rule.start_time || "",
            end_time: rule.end_time || "",
        }));
        rotationWeek = rawRules[0]?.rotation_week ?? "";
    } else if (apiItem.recurrence_type === "monthly_reminder" && rawRules.length > 0) {
        adaptedMonthly = {
            dayOfMonth: rawRules[0].day_of_month ?? "",
            requiresBusinessDay: Boolean(rawRules[0].requires_business_day),
            // Preservamos snake_case para componentes presentacionales
            day_of_month: rawRules[0].day_of_month ?? "",
            requires_business_day: Boolean(rawRules[0].requires_business_day),
        };
    }

    // 🚀 NORMALIZACIÓN DE TAGS: Objeto defensivo { id, name, color }
    const adaptedTags = Array.isArray(apiItem.tags)
        ? apiItem.tags.map((tag) => {
              if (typeof tag === "string") {
                  return { id: tag.toLowerCase(), name: tag, color: "primary" };
              }
              return {
                  id: tag.id || tag.name,
                  name: tag.name || "",
                  color: tag.color || "primary",
              };
          })
        : [];

    return {
        id: apiItem.id,
        title: apiItem.title || "",
        recurrenceType: apiItem.recurrence_type || "",
        recurrence_type: apiItem.recurrence_type || "", // Retrocompatibilidad
        notebookId: apiItem.notebook_id ?? "",
        notebook_id: apiItem.notebook_id ?? "",
        colorTheme: apiItem.color_theme || apiItem.color || "primary",
        color_theme: apiItem.color_theme || apiItem.color || "primary",
        schedules: adaptedSchedules,
        rotationWeek: rotationWeek,
        rotation_week: rotationWeek,
        ...adaptedMonthly,
        tags: adaptedTags,
    };
};

// 🚀 ALIAS OFICIAL: Garantiza la exportación esperada por plannerService.js
export const plannerFixedTaskAdapter = fixedTaskAdapter;

/**
 * Adapta el listado completo de tareas fijas para la SidebarWidget o Tablero.
 */
export const plannerFixedTaskListAdapter = (apiResponseData) => {
    if (!Array.isArray(apiResponseData)) return [];

    return apiResponseData.map((item) => fixedTaskAdapter(item)).filter(Boolean); // Limpia posibles nulos si la API devuelve ítems corruptos
};
