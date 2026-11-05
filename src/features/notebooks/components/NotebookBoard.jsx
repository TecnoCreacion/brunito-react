import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { NotebookDesktopGrid } from "./NotebookDesktopGrid";
import { NotebookMobileCarousel } from "./NotebookMobileCarousel";

export const NotebookBoard = (props) => {
    const { notebooks = [] } = props;

    // Asumimos que tienes este hook en shared/hooks según el Capítulo 2
    const isMobile = useMediaQuery("(max-width: 767px)");

    if (notebooks.length === 0) {
        return (
            <div className="text-center p-5 text-muted">
                <p>No hay libretas creadas en este tablero. ¡Agrega una nueva para comenzar!</p>
            </div>
        );
    }

    // 🚀 ARQUITECTURA: Composición limpia. El coordinador no conoce el CSS de los layouts
    if (isMobile) {
        return <NotebookMobileCarousel {...props} />;
    }

    return <NotebookDesktopGrid {...props} />;
};
