import type { RootState } from "@store/index";
import { type FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const RequireAuth: FC = () => {
    const isAuth = useSelector((state: RootState) => state.user.isAuth)
    
    return isAuth ? (
        <Outlet />
    ) : (
        <Navigate to='/login'/>
    );
};
