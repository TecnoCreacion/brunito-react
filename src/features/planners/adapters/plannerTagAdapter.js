export const plannerTagAdapter = {
    toFrontend: (rawResponse) => {
        if (!rawResponse) return null;

        // Desenvolvemos si viene dentro de ApiResponse::success({ success, data, message })
        const entity = rawResponse.data && typeof rawResponse.data === "object" && !Array.isArray(rawResponse.data) ? rawResponse.data : rawResponse;

        if (!entity || !entity.id) return null;

        return {
            id: entity.id,
            userId: entity.user_id ?? null,
            name: entity.name || "",
            color: entity.color || "primary",
            status: Boolean(entity.status ?? true),
        };
    },

    toBackend: (formData) => ({
        name: String(formData.name || "").trim(),
        color: formData.color || "primary",
    }),
};
