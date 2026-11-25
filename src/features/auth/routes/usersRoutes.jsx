import { ProfilePage } from "../pages/ProfilePage";

export const usersRoutes = [
    {
        path: "/profile",
        element: <ProfilePage />,
        meta: { title: "Datos del Usuario", public: false, restricted: true },
    },
];
