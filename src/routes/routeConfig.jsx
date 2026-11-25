import { AppLayout } from "@/layouts/AppLayout/AppLayout";
import { PublicLayout } from "@/layouts/PublicLayout/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { HomePage } from "@/features/landing/pages/HomePage";
import { PrivateRoute } from "./guards/PrivateRoute";
import { PublicRoute } from "./guards/PublicRoute";
import { authRoutes } from "@/features/auth";
import { usersRoutes } from "@/features/auth";
import { PlannerPage } from "@/features/planners";
import { plannersRoutes } from "@/features/planners";
import { notebooksRoutes } from "@/features/notebooks";

export const routeConfig = [
    {
        // 1. Rutas del ERP (Autenticadas - Tienen el AppLayout con Navbar interno)
        element: <AppLayout />,
        children: [
            {
                element: <PrivateRoute />,
                children: [
                    {
                        path: "/dashboard",
                        element: <PlannerPage />,
                    },
                    ...usersRoutes,
                    ...plannersRoutes,
                    ...notebooksRoutes,
                ],
            },
        ],
    },
    {
        // 2. Rutas de Autenticación (Usan AuthLayout limpio, sin Navbar de ERP)
        element: <AuthLayout />,
        children: [
            {
                element: <PublicRoute restricted={true} />,
                children: [
                    ...authRoutes, // Aquí vive /login
                ],
            },
        ],
    },
    {
        // 3. Páginas públicas generales (Landing page si aplica)
        element: <PublicLayout />,
        children: [{ path: "/", element: <HomePage /> }],
    },
];
