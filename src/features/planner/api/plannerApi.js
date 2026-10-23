export const plannerApi = {
    getPlannerById: "/planners",
    getPlanners: "/planners/search", // Endpoint de Laravel que retorna la tabla de recordatorios
    create: "/planners",
    update: "/planners",
    getFixedTasks: "/planner_fixed_tasks/search",
    createFixedTask: "/planner_fixed_tasks",
    updateFixedTask: "/planner_fixed_tasks",
    getTags: "/planner_tags/search",
    getResources: "/planner_resources/search",
    scheduleTasksForWeek: "/planner_fixed_tasks/schedule_week/tasks",
};
