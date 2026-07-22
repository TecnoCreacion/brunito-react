import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Dashboard } from "@/features/dashboard/components/Dashboard";
import { Login } from "@/features/auth/components/Login";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { NotFound } from "@/components/errors/NotFound";
import { ServerError } from "@/components/errors/ServerError";

import { UserManagement } from "@/features/users/components/UserManagement";

export const router = createBrowserRouter([
    {
        // Rutas protegidas (El ERP en sí)
        path: "/",
        element: <ProtectedRoute />, // La plantilla envuelve todo
        errorElement: <ServerError />,
        children: [
            {
                path: "",
                element: <MainLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                    {
                        path: "users",
                        element: <UserManagement />,
                    },
                ],
            },
        ],
    },
    {
        // Rutas públicas (Login)
        path: "/login",
        element: <Login />,
    },
    {
        path: "/500",
        element: <ServerError />,
    },
    {
        // Manejo del error 404
        path: "*",
        element: <NotFound />,
    },
]);
