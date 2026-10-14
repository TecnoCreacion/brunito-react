export const bigCalendarEventAdapter = (apiEvent) => {
    return {
        id: apiEvent.id,
        title: apiEvent.title,
        // react-big-calendar exige objetos Date nativos
        start: new Date(apiEvent.start_date),
        end: apiEvent.end_date ? new Date(apiEvent.end_date) : new Date(apiEvent.start_date),
        allDay: apiEvent.all_day || false,
        resourceId: apiEvent.user_id, // Clave para que se agrupe por columna en vista Día/Semana
        // Metadata extra
        color: apiEvent.color || "blue",
    };
};

export const bigCalendarResourceAdapter = (apiUser) => {
    return {
        resourceId: apiUser.id, // Debe coincidir con el resourceId del evento
        resourceTitle: apiUser.name, // Nombre que aparecerá en la cabecera de la columna
    };
};
