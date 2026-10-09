import { useState, useMemo } from "react";
import { usePlanner } from "./usePlanner";

export const usePlannerEvents = (userId) => {
    const { events, isLoading, isError } = usePlanner(userId);
    const [selectedTags, setSelectedTags] = useState([]);

    const filteredEvents = useMemo(() => {
        if (selectedTags.length === 0 || !events) return events;
        return events.filter((event) => {
            const eventTags = event.extendedProps?.tags || event.tags || [];
            return eventTags.some((tag) => selectedTags.includes(tag.id));
        });
    }, [events, selectedTags]);

    const toggleTag = (tagId) => {
        setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
    };

    return {
        events: filteredEvents,
        isLoading,
        isError,
        selectedTags,
        toggleTag,
    };
};
