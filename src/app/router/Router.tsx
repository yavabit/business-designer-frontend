import { Layout } from "@app/layouts/Layout/Layout";
import { Login } from "@pages/Login/Login";
import { ProcessConstructor } from "@pages/ProcessConstructor/ProcessConstructor";
import { Processes } from "@pages/Processes/Processes";
import { Profile } from "@pages/Profile/Profile";
import { Projects } from "@pages/Projects/Projects";
import { Signup } from "@pages/Signup/Signup";
import { Routes, Route, Navigate } from "react-router-dom";

export const Router = () => {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<Projects />} />
				<Route path="project/:projectId" element={<Processes />} />
				<Route path="process/:processId" element={<ProcessConstructor />} />

				<Route path="login" element={<Login />} />
				<Route path="signup" element={<Signup />} />

				<Route path="me" element={<Profile />} />

				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	);
};
