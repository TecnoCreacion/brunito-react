import { useState } from "react";
import { IconPlus, IconDeviceFloppy } from "@tabler/icons-react";
import { useNotebookQuery } from "../queries/useNotebooksQuery";
// 🚀 ARQUITECTURA: Consumimos la capa 3 (Hooks orquestadores) en lugar de mutaciones sueltas
import { useNotebookMutations } from "../hooks/useNotebookMutations";
import { useNoteMutations } from "../hooks/useNoteMutations";
import { NoteListItem } from "./NoteListItem"; // 🚀 COMPOSICIÓN: Reutilizamos el componente corporativo

export const NotebookDetailModal = ({ notebook, isOpen, onClose }) => {
    // 1. Estados locales para la edición del Notebook (Padre)
    const [title, setTitle] = useState(notebook?.title || "");
    const [description, setDescription] = useState(notebook?.description || "");

    // 2. Estados locales para la experiencia de creación de la Nota (Hijo)
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [newNoteContent, setNewNoteContent] = useState("");

    // 3. Integración con TanStack Query (Capa 3 y 4)
    const { data: notebookDetail, isLoading: isLoadingDetail } = useNotebookQuery(notebook?.id);
    const notes = notebookDetail?.notes || []; // 🛡️ Protección defensiva

    // 🚀 Obtenemos acciones limpias desde los Hooks de Feature
    const { updateNotebook, isUpdating } = useNotebookMutations();
    const { createNote, isCreatingNote, updateNote, deleteNote } = useNoteMutations();

    if (!isOpen || !notebook) return null;

    // ==========================================
    // HANDLERS (Delegación a Capa 4)
    // ==========================================
    const handleSaveNotebook = () => {
        updateNotebook({
            id: notebook.id,
            data: { title, description },
        });
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNoteContent.trim() && !newNoteTitle.trim()) return;

        try {
            await createNote({
                notebookId: notebook.id,
                payload: {
                    notebook_id: notebook.id,
                    title: newNoteTitle,
                    content: newNoteContent,
                },
            });
            // Limpiamos y cerramos el formulario al tener éxito
            setNewNoteTitle("");
            setNewNoteContent("");
            setIsAddingNote(false);
        } catch (error) {
            console.error("Error al crear la nota", error);
        }
    };

    const handleCancelAddNote = () => {
        setNewNoteTitle("");
        setNewNoteContent("");
        setIsAddingNote(false);
    };

    // 🚀 LÓGICA DE NEGOCIO VISUAL: Devuelve Promise para que NoteListItem controle sus Spinners
    const handleEditNote = async (updatedNote) => {
        try {
            await updateNote({
                notebookId: notebook.id,
                noteId: updatedNote.id,
                payload: { title: updatedNote.title, content: updatedNote.content },
            });
            return true;
        } catch (error) {
            console.error("Error al actualizar la nota", error);
            return false;
        }
    };

    const handleDeleteNote = async (noteToDelete) => {
        try {
            await deleteNote({ notebookId: notebook.id, noteId: noteToDelete.id });
            return true;
        } catch (error) {
            console.error("Error al eliminar la nota", error);
            return false;
        }
    };

    return (
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>

            <div className="modal modal-blur fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
                    <div className="modal-content shadow-lg border-0">
                        {/* Cabecera */}
                        <div className="modal-header bg-light">
                            <h5 className="modal-title font-weight-bold d-flex align-items-center gap-2">
                                <span className={`badge bg-${notebook.colorTheme === "white-blank" ? "secondary" : "warning"}`}>{notebook.size?.toUpperCase()}</span>
                                Detalles de la Libreta
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
                        </div>

                        <div className="modal-body p-4">
                            <div className="row g-4 h-100">
                                {/* Columna Izquierda: Detalles del Notebook */}
                                <div className="col-md-5 border-end">
                                    <h4 className="mb-3 text-muted" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Configuración
                                    </h4>
                                    <div className="mb-3">
                                        <label className="form-label">Título de la Libreta</label>
                                        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Tareas de la semana" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Descripción</label>
                                        <textarea className="form-control" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Añade un contexto a esta libreta..."></textarea>
                                    </div>
                                    <button className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2" onClick={handleSaveNotebook} disabled={isUpdating}>
                                        {isUpdating ? <span className="spinner-border spinner-border-sm" role="status"></span> : <IconDeviceFloppy size={18} />}
                                        {isUpdating ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                </div>

                                {/* Columna Derecha: Listado de Notas */}
                                <div className="col-md-7 d-flex flex-column">
                                    <h4 className="mb-3 text-muted" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Notas ({notes.length})
                                    </h4>

                                    {/* 🚀 FORMULARIO AMIGABLE PARA NUEVA NOTA (Capa 10: Formularios)[cite: 7] */}
                                    {!isAddingNote ? (
                                        <button className="btn btn-outline-primary w-100 mb-3 border-dashed d-flex justify-content-center align-items-center gap-2 py-3" onClick={() => setIsAddingNote(true)}>
                                            <IconPlus size={20} stroke={2} />
                                            <span>Agregar nueva nota</span>
                                        </button>
                                    ) : (
                                        <div className="card shadow-sm border-primary mb-3">
                                            <div className="card-body p-3">
                                                <input type="text" className="form-control fw-bold border-0 px-1 mb-2 fs-5" placeholder="Título de la nota..." value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} disabled={isCreatingNote} autoFocus />
                                                <textarea className="form-control border-0 px-1 text-muted hide-scrollbar" rows="3" placeholder="Escribe los detalles aquí..." value={newNoteContent} onChange={(e) => setNewNoteContent(e.target.value)} disabled={isCreatingNote} style={{ resize: "none" }}></textarea>
                                            </div>
                                            <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end gap-2 pt-0 pb-3 px-3">
                                                <button className="btn btn-ghost-secondary btn-sm" onClick={handleCancelAddNote} disabled={isCreatingNote}>
                                                    Cancelar
                                                </button>
                                                <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={handleAddNote} disabled={isCreatingNote || (!newNoteTitle.trim() && !newNoteContent.trim())}>
                                                    {isCreatingNote ? <span className="spinner-border spinner-border-sm"></span> : <IconDeviceFloppy size={16} />}
                                                    Guardar Nota
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* 🚀 REUTILIZACIÓN (Capa 9): Listado de Notas Renderizadas con nuestro Componente Corporativo[cite: 7] */}
                                    <div className="d-flex flex-column gap-2" style={{ overflowY: "auto", flexGrow: 1, paddingRight: "5px" }}>
                                        {isLoadingDetail ? (
                                            <div className="p-5 text-center text-muted">
                                                <span className="spinner-border spinner-border-sm mb-2"></span>
                                                <p className="small mb-0">Cargando detalles...</p>
                                            </div>
                                        ) : notes.length === 0 && !isAddingNote ? (
                                            <div className="p-5 text-center text-muted border rounded border-dashed">Esta libreta está vacía. ¡Agrega tu primera nota!</div>
                                        ) : (
                                            notes.map((note, index) => (
                                                <NoteListItem
                                                    key={note.id}
                                                    note={note}
                                                    isFirst={index === 0}
                                                    isLast={index === notes.length - 1}
                                                    disabled={isCreatingNote} // Se opacan si se está creando una nueva por encima
                                                    onEdit={handleEditNote} // 🚀 El componente maneja internamente sus botones y spinners
                                                    onDelete={handleDeleteNote}
                                                    // Opcional: onMoveUp / onMoveDown si en el modal permites reordenar.
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
