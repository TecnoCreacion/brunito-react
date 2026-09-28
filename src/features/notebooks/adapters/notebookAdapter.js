export const notebookAdapter = (rawNotebook) => {
    return {
        id: rawNotebook.id,
        user: rawNotebook.user || null,
        title: rawNotebook.title || "",
        description: rawNotebook.description || "",
        position: rawNotebook.position ?? 0,
        colorTheme: rawNotebook.color_theme || "yellow-lined",
        size: rawNotebook.size || "md",
        status: rawNotebook.status,
        createdAt: rawNotebook.created_at,
    };
};

export const notebooksAdapter = (rawNotebooks = []) => {
    return rawNotebooks.map(notebookAdapter);
};
