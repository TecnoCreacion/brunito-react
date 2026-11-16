import { noteAdapter } from "./noteAdapter";

export const notebookAdapter = (rawNotebook) => {
    return {
        id: rawNotebook.id,
        user: rawNotebook.user
            ? {
                  id: rawNotebook.user.id,
                  name: rawNotebook.user.name,
              }
            : null,
        title: rawNotebook.title || "",
        description: rawNotebook.description || "",
        position: rawNotebook.position ?? 0,
        colorTheme: rawNotebook.color_theme || "yellow-lined",
        size: rawNotebook.size || "md",
        isPinned: Boolean(rawNotebook.is_pinned),
        status: Boolean(rawNotebook.status),
        deletedAt: rawNotebook.deleted_at,
        createdAt: rawNotebook.created_at,
        notes: Array.isArray(rawNotebook.notes) ? rawNotebook.notes.map(noteAdapter) : [],
    };
};

export const notebooksAdapter = (rawNotebooks = []) => {
    return rawNotebooks.map(notebookAdapter);
};
