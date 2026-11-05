import { useMemo, useRef } from "react";
import { NotebookCard } from "./NotebookCard";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export const NotebookMobileCarousel = (props) => {
    const { notebooks = [] } = props;
    const carouselRef = useRef(null);

    // 🚀 LÓGICA VISUAL: Garantizamos que la fijada sea siempre el índice 0
    const sortedNotebooks = useMemo(() => {
        // ⚠️ ADVERTENCIA ARQUITECTÓNICA: is_pinned es deuda técnica.
        // Recuerda mapearlo a camelCase (isPinned) en la Capa 5 (Adapter) a futuro.
        const pinned = notebooks.find((n) => n.is_pinned);
        const unpinned = notebooks.filter((n) => !n.is_pinned);
        return pinned ? [pinned, ...unpinned] : unpinned;
    }, [notebooks]);

    // 🚀 INTERACCIÓN NATIVA: Desplazamos el contenedor
    const handleScroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = window.innerWidth * 0.85;
            carouselRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="position-relative">
            {/* 🚀 ARQUITECTURA VISUAL: Reemplazamos position-absolute por position-fixed
                Esto ancla el botón al centro del "viewport" (pantalla del móvil) */}
            <button className="btn btn-icon btn-light position-fixed top-50 start-0 translate-middle-y shadow-lg" onClick={() => handleScroll("left")} style={{ zIndex: 1050, marginLeft: "4px", borderRadius: "50%" }} aria-label="Anterior libreta">
                <IconChevronLeft size={20} />
            </button>

            <div
                ref={carouselRef}
                className="d-flex overflow-x-auto pb-3 gap-3 hide-scrollbar"
                style={{
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    scrollBehavior: "smooth",
                }}
            >
                {sortedNotebooks.map((notebook) => (
                    <div
                        key={notebook.id}
                        className="flex-shrink-0 position-relative"
                        style={{
                            width: "85vw",
                            scrollSnapAlign: "center",
                        }}
                    >
                        <NotebookCard notebook={notebook} {...props} isMobileLayout={true} />
                    </div>
                ))}
            </div>

            {/* 🚀 ARQUITECTURA VISUAL: position-fixed para el lado derecho */}
            <button className="btn btn-icon btn-light position-fixed top-50 end-0 translate-middle-y shadow-lg" onClick={() => handleScroll("right")} style={{ zIndex: 1050, marginRight: "4px", borderRadius: "50%" }} aria-label="Siguiente libreta">
                <IconChevronRight size={20} />
            </button>
        </div>
    );
};
