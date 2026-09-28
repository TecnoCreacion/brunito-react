import { useEffect } from "react";
import { ENV } from "@/config/env";

export const useDocumentTitle = (title) => {
    useEffect(() => {
        const previousTitle = document.title;
        const appName = ENV.APP_NAME;

        document.title = title ? `${title} | ${appName}` : appName;

        return () => {
            document.title = previousTitle;
        };
    }, [title]);
};
