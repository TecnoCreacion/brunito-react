import { PlannerPage } from "../pages/PlannerPage";

export const plannersRoutes = [
    {
        path: "/planners",
        element: <PlannerPage />,
        permission: "planners.index", // Integrado con el sistema de permisos de BrunOS
        meta: {
            title: "Agenda y Calendario",
            breadcrumb: "Agenda y Calendario",
        },
    },
];
