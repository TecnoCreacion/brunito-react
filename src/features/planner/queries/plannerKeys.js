export const plannerKeys = {
    all: ["planners"],
    getPlanners: () => [...plannerKeys.all, "planner"],
    getPlannersByUser: (userId) => [...plannerKeys.getPlanners(), { user_id: userId }],

    // Nuevas llaves para el Sidebar
    fixedTasks: (userId) => [...plannerKeys.all, "fixed-tasks", userId],
    tags: () => [...plannerKeys.all, "tags"],
};
