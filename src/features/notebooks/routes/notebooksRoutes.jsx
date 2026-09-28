import { NotebooksPage } from "../pages/NotebooksPage";

export const notebooksRoutes = [
    {
        path: "/notebooks",
        element: <NotebooksPage />,
        permission: "notebooks.index", // Integrado con el sistema de permisos de BrunOS
        meta: {
            title: "Libretas",
            breadcrumb: "Libretas y Notas",
        },
    },
];
