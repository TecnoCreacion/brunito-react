import { RouterProvider } from "react-router-dom";
import { router } from "@/router"; // Crearemos esto en el Paso 3

// Estilos globales de Tabler (Bootstrap 5 vitaminado)
import "@tabler/core/dist/css/tabler.min.css";
// Scripts de Tabler (necesario para dropdowns, modales, offcanvas, etc.)
import "@tabler/core/dist/js/tabler.min.js";

function App() {
    return (
        // RouterProvider es el motor que inyectará las URLs
        <RouterProvider router={router} />
    );
}

export default App;
