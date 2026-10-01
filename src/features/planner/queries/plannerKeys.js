export const plannerKeys = {
    all: ["planners"],
    getPlanners: () => [...plannerKeys.all, "planner"],
    getPlannersByUser: (userId) => [...plannerKeys.getPlanners(), { user_id: userId }],

    events: {
        all: () => [...plannerKeys.all, "event"],
        allByUser: (userId) => [...plannerKeys.getPlanners(), { user_id: userId }],
        list: (userId, filters) => [...plannerKeys.events.all(userId), "list", filters],
    },

    // Nuevas llaves para el Sidebar
    // fixedTasks: (userId) => [...plannerKeys.all, "fixed-tasks", userId],
    fixedTasks: {
        all: (userId) => [...plannerKeys.all, "fixed-tasks", userId],
        // ESTA ES LA FUNCIÓN QUE REACT QUERY ESTÁ BUSCANDO Y NO ENCUENTRA
        list: (userId) => [...plannerKeys.fixedTasks.all(userId), "list"],
        detail: (userId, id) => [...plannerKeys.fixedTasks.all(userId), "detail", id],
    },

    tags: () => [...plannerKeys.all, "tags"],
};
