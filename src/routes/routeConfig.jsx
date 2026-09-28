import { AppLayout } from "@/layouts/AppLayout/AppLayout";
import { PublicLayout } from "@/layouts/PublicLayout/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PrivateRoute } from "./guards/PrivateRoute";
import { PublicRoute } from "./guards/PublicRoute";
import { authRoutes } from "@/features/auth/routes/authRoutes";
import { HomePage } from "@/features/landing/pages/HomePage";
import { PlannerPage } from "@/features/planner";
import { plannersRoutes } from "@/features/planner/routes/plannersRoutes";
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
