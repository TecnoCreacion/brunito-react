import { Outlet } from "react-router-dom";

export const BlankLayout = () => {
    return (
        <div className="page page-center border-top-wide border-primary d-flex flex-column">
            <Outlet />
        </div>
    );
};
