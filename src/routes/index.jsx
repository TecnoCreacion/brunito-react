import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routeConfig } from "./routeConfig";

// Creamos la instancia del router basada en nuestra configuración estricta
const router = createBrowserRouter(routeConfig);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
