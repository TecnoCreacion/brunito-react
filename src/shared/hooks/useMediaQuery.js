import { useState, useEffect } from "react";

export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const media = window.matchMedia(query);

        // El listener solo actualizará el estado si la pantalla cambia de tamaño en el futuro.
        const listener = (event) => setMatches(event.matches);

        media.addEventListener("change", listener);

        // Limpieza pura de la suscripción al desmontar
        return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
};
