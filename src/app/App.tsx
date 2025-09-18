import { ConfigProvider } from "antd";
import "./App.scss";
import { Router } from "./router/Router";
import { useTheme } from "@hooks/useTheme";

function App() {
  const { currentTheme } = useTheme();

  return (
    <ConfigProvider theme={currentTheme}>
      <Router />
    </ConfigProvider>
  );
}

export default App;
