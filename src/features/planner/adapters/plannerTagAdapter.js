export const plannerTagAdapter = {
    toFrontend: (apiTag) => ({
        id: apiTag.id,
        name: apiTag.name || "",
        color: apiTag.color || "primary",
    }),

    toBackend: (formData) => ({
        name: formData.name.trim(),
        color: formData.color,
    }),
};
