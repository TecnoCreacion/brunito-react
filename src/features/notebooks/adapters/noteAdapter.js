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
