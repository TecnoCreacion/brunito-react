export const notebooksKeys = {
    all: ["notebooks"],
    lists: () => [...notebooksKeys.all, "list"],
    list: (filters) => [...notebooksKeys.lists(), { filters }],
    details: () => [...notebooksKeys.all, "detail"],
    detail: (id) => [...notebooksKeys.details(), id],

    // Llave específica para solicitar el listado de notas dentro de un Notebook
    notes: (notebookId) => [...notebooksKeys.detail(notebookId), "notes"],
};
