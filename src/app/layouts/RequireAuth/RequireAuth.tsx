import type { RootState } from "@store/index";
import { type FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const RequireAuth: FC = () => {
    const { isAuth, token } = useSelector((state: RootState) => state.user);

    return (isAuth && token) ? (
        <Outlet />
    ) : (
        <Navigate to='/login' replace />
    );
};