import { useState } from "react";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useNotebookMutations } from "../hooks/useNotebookMutations"; // 🚀 ARQUITECTURA: Hook Orquestador (Capa 3)[cite: 7]
import { useNoteMutations } from "../hooks/useNoteMutations";
import { NotebookBoard } from "../components/NotebookBoard";
import { NotebookDetailModal } from "../components/NotebookDetailModal";
import { IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { alerts } from "@/shared/utils/alerts";

export const NotebooksPage = () => {
    useDocumentTitle("Libretas y Notas");

    const { user } = useAuth();

    // 🚀 ARQUITECTURA: Único punto de contacto con el dominio Notebooks (Capa 3)[cite: 7]
    const { notebooks, isLoading, isError, createNotebook, deleteNotebook, updateNotebook, togglePin, isCreating } = useNotebookMutations({ with: "user", where: { user_id: user.id } });

    // Acciones del subdominio de Notas
    const { updateNote, deleteNote } = useNoteMutations();

    // 🚀 ESTADO LOCAL: Exclusivamente para feedback visual del DOM (Capa 1)[cite: 7]
    const [deletingId, setDeletingId] = useState(null);
    const [selectedNotebook, setSelectedNotebook] = useState(null);

    const handleQuickCreate = async () => {
        try {
            // 🚀 ARQUITECTURA: Frontend opera en camelCase. El Adapter/Service traduce a Laravel[cite: 7]
            await createNotebook({
                title: "Nueva Libreta Adhesiva",
                description: "Escribe tus notas aquí...",
                color_theme: "yellow-lined",
                size: "md",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await alerts.confirmDelete("¿Eliminar esta libreta?", "Se perderán todas las notas contenidas en ella. Esta acción es irreversible.");

        if (!isConfirmed) return;

        setDeletingId(id);

        try {
            await deleteNotebook(id);
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleUpdateSize = (notebookId, newData) => {
        updateNotebook({
            id: notebookId,
            data: newData,
        });
    };

    const handleTogglePin = (id, isPinned) => {
        // 🚀 Delegado al manejador unificado del Hook Orquestador[cite: 7]
        togglePin({ id, isPinned });
    };

    const handleEditNote = async (notebookId, updatedNote) => {
        try {
            await updateNote({
                notebookId,
                noteId: updatedNote.id,
                payload: { title: updatedNote.title, content: updatedNote.content },
            });
            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    };

    const handleDeleteNote = async (notebookId, noteId) => {
        try {
            await deleteNote({ notebookId, noteId });
            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    };

    return (
        <div className="page-body mt-0 pt-0 px-3">
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
                <NotebookBoard notebooks={notebooks} onDelete={handleDelete} deletingId={deletingId} onEdit={(notebook) => setSelectedNotebook(notebook)} onAddNote={(notebook) => setSelectedNotebook(notebook)} onUpdateSize={handleUpdateSize} onTogglePin={handleTogglePin} onEditNote={handleEditNote} onDeleteNote={handleDeleteNote} />
            )}

            <NotebookDetailModal key={selectedNotebook?.id || "empty-modal"} notebook={selectedNotebook} isOpen={!!selectedNotebook} onClose={() => setSelectedNotebook(null)} onEditNote={handleEditNote} onDeleteNote={handleDeleteNote} />
        </div>
    );
};
