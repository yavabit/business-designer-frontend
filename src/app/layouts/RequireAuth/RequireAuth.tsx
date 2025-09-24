import type { RootState } from "@store/index";
import { type FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";

export const RequireAuth: FC = () => {
    const { isAuth, isLoading, token } = useSelector((state: RootState) => state.user);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    if (isChecking || isLoading) {
        return <Spin size="large" />;
    }

    return (isAuth && token) ? (
        <Outlet />
    ) : (
        <Navigate to='/login' replace />
    );
};