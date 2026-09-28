import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout"; // Debemos usar un AuthLayout para el login
import { PrivateRoute } from "./PrivateRoute";

// Importamos páginas de infraestructura de errores
import { NotFoundPage } from "./errors/NotFoundPage";
import { ServerErrorPage } from "./errors/ServerErrorPage";

// Importamos las rutas desde la API pública de cada Feature
import { authRoutes } from "@/features/auth";
import { dashboardRoutes } from "@/features/dashboard";
import { usersRoutes } from "@/features/users";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoute />,
        errorElement: <ServerErrorPage />,
        children: [
            {
                path: "/",
                element: <MainLayout />,
                children: [
                    ...dashboardRoutes,
                    ...usersRoutes,
                    // Mañana agregaremos ...inventoryRoutes, ...salesRoutes con 1 sola línea
                ],
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: [...authRoutes],
    },
    {
        path: "/500",
        element: <ServerErrorPage />,
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);
