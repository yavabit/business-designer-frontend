import { Layout } from "@app/layouts/Layout/Layout";
import { DnDProvider } from "@contexts/DnDContext";
import { ReactFlowProvider } from "@xyflow/react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "@app/layouts/RequireAuth/RequireAuth";
import { Suspense, lazy } from "react";
import { Spin } from "antd";
import { Projects } from "@pages/Projects/Projects";

const Signin = lazy(() =>
  import("@pages/Signin/Signin").then((module) => ({ default: module.Signin }))
);
const Signup = lazy(() =>
  import("@pages/Signup/Signup").then((module) => ({ default: module.Signup }))
);
const ProcessConstructor = lazy(() =>
  import("@pages/ProcessConstructor/ProcessConstructor").then((m) => ({ default: m.ProcessConstructor }))
);
const Processes = lazy(() =>
  import("@pages/Processes/Processes").then((m) => ({ default: m.Processes }))
);
const Profile = lazy(() =>
  import("@pages/Profile/Profile").then((m) => ({ default: m.Profile }))
);
const Roadmap = lazy(() =>
  import("@pages/Roadmap/Roadmap").then((m) => ({ default: m.Roadmap }))
);

export const Router = () => {
  return (
    <Suspense fallback={<Spin fullscreen/>}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route index element={<Projects />} />
            <Route path="project/:projectId" element={<Processes />} />
            <Route
              path="process/:processId"
              element={
                <ReactFlowProvider>
                  <DnDProvider>
                    <ProcessConstructor />
                  </DnDProvider>
                </ReactFlowProvider>
              }
            />
            <Route path="me" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
        <Route element={<Layout />}>
          <Route path="roadmap" element={<Roadmap />} />
        </Route>
        <Route path="login" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </Suspense>
  );
};
