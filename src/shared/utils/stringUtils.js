export const getInitials = (name) => {
    if (!name) return "?";

    const words = name.trim().split(" ");

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    // Tomamos la primera letra del primer y último nombre/apellido
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};
