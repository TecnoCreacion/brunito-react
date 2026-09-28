import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

export const authRoutes = [
    {
        path: "/login",
        element: <LoginPage />,
        meta: { title: "Iniciar Sesión", public: true, restricted: true },
    },
    {
        path: "/register",
        element: <RegisterPage />,
        meta: { title: "Crear una cuenta", public: true, restricted: true },
    },
    {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
        meta: { title: "Olvidé mi contraseña", public: true, restricted: true },
    },
];
