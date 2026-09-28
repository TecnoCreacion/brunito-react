import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "./app/providers";
import { App } from "./app/App";

// Estilos globales de Tabler
import "@tabler/core/dist/css/tabler.min.css";
import "@tabler/core/dist/js/tabler.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppProviders>
            <App />
        </AppProviders>
    </React.StrictMode>,
);
