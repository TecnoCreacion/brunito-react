import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// 1. Importamos el proveedor de Autenticación
import { AuthProvider } from "./features/auth/context/AuthContext";

import App from "./app/App.jsx";

// Aquí luego importaremos los estilos de Tabler/Bootstrap

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* Proveedor global de TanStack Query (El motor de datos) */}
        <QueryClientProvider client={queryClient}>
            {/* Proveedor de Autenticación (El guardián de la sesión) */}
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
