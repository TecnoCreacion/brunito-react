import { getInitials } from "@/shared/utils/stringUtils";

export const Avatar = ({ name, size = "sm", className = "" }) => {
    const initials = getInitials(name);

    return (
        <span className={`avatar avatar-${size} bg-primary text-white rounded ${className}`} title={name}>
            {initials}
        </span>
    );
};
