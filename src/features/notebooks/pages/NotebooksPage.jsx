import { useState } from "react";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useNotebooksBoard } from "../hooks/useNotebooksBoard";
import { NotebookBoard } from "../components/NotebookBoard";
import { NotebookDetailModal } from "../components/NotebookDetailModal";
import { IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { alerts } from "@/shared/utils/alerts";
import { useUpdateNotebookMutation } from "../mutations/useUpdateNotebookMutation";
import { useTogglePinMutation } from "../mutations/useTogglePinMutation";

export const NotebooksPage = () => {
    useDocumentTitle("Libretas y Notas");

    const { user } = useAuth();

    // 1. Extraemos isCreating directamente del Hook (alimentado por TanStack Query)
    const { notebooks, isLoading, isError, createNotebook, deleteNotebook, isCreating } = useNotebooksBoard();

    // Extraemos la función mutate desde nuestra mutación de TanStack Query (Capa 4)
    const { mutate: updateNotebook } = useUpdateNotebookMutation();
    const { mutate: togglePinNotebook } = useTogglePinMutation();

    // 2. Estado local estrictamente visual para saber qué ID está girando (eliminándose)
    const [deletingId, setDeletingId] = useState(null);
    const [selectedNotebook, setSelectedNotebook] = useState(null); // Estado para el modal

    const handleQuickCreate = async () => {
        try {
            await createNotebook({
                user_id: user.id,
                title: "Nueva Libreta Adhesiva",
                description: "Escribe tus notas aquí...",
                color_theme: "yellow-lined",
                size: "md",
            });
        } catch (error) {
            console.error("Error al crear la libreta", error);
        }
    };

    const handleDelete = async (id) => {
        // 1. Detenemos la ejecución y pedimos confirmación al usuario
        const isConfirmed = await alerts.confirmDelete("¿Eliminar esta libreta?", "Se perderán todas las notas contenidas en ella. Esta acción es irreversible.");

        // 2. Si el usuario canceló (cerró el modal o presionó cancelar), abortamos la función
        if (!isConfirmed) return;

        // 3. Si confirmó, procedemos con el flujo de carga y eliminación
        setDeletingId(id);
        try {
            await deleteNotebook(id);
        } catch (error) {
            console.error("Error al eliminar la libreta", error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleUpdateSize = (notebookId, newData) => {
        updateNotebook({
            id: notebookId,
            data: newData, // Ej: { size: 'lg' }
        });
    };

    const handleTogglePin = (id, isPinned) => {
        togglePinNotebook({ id, isPinned });
    };

    return (
        <div className="page-body">
            <div className="container-xl">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="page-title">Tablero de Libretas</h2>
                        <p className="text-muted small mb-0">Organiza tus espacios de notas visuales</p>
                    </div>

                    <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleQuickCreate} disabled={isCreating}>
                        {isCreating ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <IconPlus size={18} />}
                        <span>{isCreating ? "Creando..." : "Nueva Libreta"}</span>
                    </button>
                </div>

                {isError && (
                    <div className="alert alert-danger" role="alert">
                        Error al sincronizar las libretas con el servidor.
                    </div>
                )}

                {isLoading ? (
                    <div className="card shadow-sm border-0 p-5 text-center text-muted">
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Cargando tablero de libretas...
                    </div>
                ) : (
                    <NotebookBoard
                        notebooks={notebooks}
                        onDelete={handleDelete}
                        deletingId={deletingId}
                        onEdit={(notebook) => setSelectedNotebook(notebook)} // Abrimos el modal al editar
                        onAddNote={(notebook) => setSelectedNotebook(notebook)}
                        onUpdateSize={handleUpdateSize}
                        onTogglePin={handleTogglePin}
                    />
                )}

                {/* Renderizamos el Modal fuera del flujo principal del documento */}
                <NotebookDetailModal key={selectedNotebook?.id || "empty-modal"} notebook={selectedNotebook} isOpen={!!selectedNotebook} onClose={() => setSelectedNotebook(null)} />
            </div>
        </div>
    );
};
