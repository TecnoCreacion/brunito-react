export const notebookAdapter = (rawNotebook) => {
    return {
        id: rawNotebook.id,
        user: rawNotebook.user || null,
        title: rawNotebook.title || "",
        description: rawNotebook.description || "",
        position: rawNotebook.position ?? 0,
        colorTheme: rawNotebook.color_theme || "yellow-lined",
        size: rawNotebook.size || "md",
        isPinned: Boolean(rawNotebook.is_pinned),
        status: Boolean(rawNotebook.status),
        createdAt: rawNotebook.created_at,
        notes: Array.isArray(rawNotebook.notes) ? rawNotebook.notes.map(noteAdapter) : [],
    };
};

export const notebooksAdapter = (rawNotebooks = []) => {
    return rawNotebooks.map(notebookAdapter);
};

export const noteAdapter = (note) => ({
    id: note.id,
    user: note.user_id,
    title: note.title || "",
    content: note.content || note.description || "",
    order: note.order || 0,
    status: Boolean(note.status),
    createdAt: note.created_at,
});

export const notesAdapter = (notes) => {
    return notes.map(noteAdapter);
};
