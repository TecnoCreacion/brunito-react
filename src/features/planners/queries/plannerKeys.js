export const plannerKeys = {
    all: ["planners"],

    // Listados
    lists: () => [...plannerKeys.all, "list"],
    list: (filters) => [...plannerKeys.lists(), filters],

    // Consultas generales
    queries: () => [...plannerKeys.all, "query"],
    getPlanners: () => [...plannerKeys.queries(), "planner"],
    getPlannersByUser: (userId) => [...plannerKeys.getPlanners(), { user_id: userId }],

    // Detalles
    details: () => [...plannerKeys.all, "detail"],
    detail: (id) => [...plannerKeys.details(), id],

    // Compatibilidad con nombres anteriores
    getPlannerById: (id) => plannerKeys.detail(id),

    // Eventos
    events: {
        all: () => [...plannerKeys.all, "event"],
        allByUser: (userId) => [...plannerKeys.events.all(), { user_id: userId }],
        list: (userId, filters = {}) => [...plannerKeys.events.allByUser(userId), "list", filters],
    },

    // Tareas fijas
    fixedTasks: {
        all: (userId) => [...plannerKeys.all, "fixed-tasks", userId],
        list: (userId) => [...plannerKeys.fixedTasks.all(userId), "list"],
        detail: (userId, id) => [...plannerKeys.fixedTasks.all(userId), "detail", id],
    },

    // Etiquetas
    tags: () => [...plannerKeys.all, "tags"],

    // Recursos
    resources: () => [...plannerKeys.all, "resources"],
};
