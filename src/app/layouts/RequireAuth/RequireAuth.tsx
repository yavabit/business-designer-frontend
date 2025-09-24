import type { RootState } from "@store/index";
import { type FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";

export const RequireAuth: FC = () => {
    const { isAuth, isLoading, token } = useSelector((state: RootState) => state.user);

    if ( isLoading) {
        return <Spin size="large" />;
    }

    return (isAuth && token) ? (
        <Outlet />
    ) : (
        <Navigate to='/login' replace />
    );
};