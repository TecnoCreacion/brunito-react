export const fixedTaskAdapter = (apiItem) => {
    if (!apiItem) return null;

    const rawRules = apiItem.rules || [];

    let adaptedSchedules = [{ days_of_week: [], start_time: "", end_time: "" }];
    let adaptedMonthly = { day_of_month: "", requires_business_day: false };
    let rotationWeek = "";

    if (apiItem.recurrence_type === "work_shift" && rawRules.length > 0) {
        adaptedSchedules = rawRules.map((rule) => ({
            days_of_week: Array.isArray(rule.days_of_week) ? rule.days_of_week.map(Number) : [],
            start_time: rule.start_time || "",
            end_time: rule.end_time || "",
        }));
        rotationWeek = rawRules[0]?.rotation_week ?? "";
    } else if (apiItem.recurrence_type === "monthly_reminder" && rawRules.length > 0) {
        adaptedMonthly = {
            day_of_month: rawRules[0].day_of_month ?? "",
            requires_business_day: rawRules[0].requires_business_day ?? false,
        };
    }

    return {
        id: apiItem.id,
        title: apiItem.title || "",
        recurrence_type: apiItem.recurrence_type || "",
        notebook_id: apiItem.notebook_id ?? "",
        schedules: adaptedSchedules,
        rotation_week: rotationWeek,
        ...adaptedMonthly,
        // Normalizamos los tags a un arreglo de strings
        tags: apiItem.tags ? apiItem.tags.map((tag) => tag.name) : [],
    };
};

// 🚀 2. Adaptador para la lista completa (El que usarás en tu Service)
export const plannerFixedTaskListAdapter = (apiResponseData) => {
    if (!Array.isArray(apiResponseData)) return [];

    // Mapeamos cada elemento de la respuesta cruda por nuestro adaptador individual
    return apiResponseData.map((item) => fixedTaskAdapter(item));
};
