import { ConfigProvider, Spin } from "antd";
import "./App.scss";
import { Router } from "./router/Router";
import { useTheme } from "@hooks/useTheme";
import { useLazyCheckAuthQuery } from "@store/api/user/userApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@store/user/userSlice";
import { useNavigate } from "react-router-dom";

function App() {
  const { currentTheme } = useTheme();

  const [checkAuth, checkAuthData] = useLazyCheckAuthQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth()
      .then(res => {
        if (res.data) {
          dispatch(setCredentials({
            accessToken: res.data.accessToken,
            email: res.data.data.email,
            id: res.data.data.id 
          }))
          navigate('/')
        }
      })
  }, [])

  return (
    <ConfigProvider theme={currentTheme}>
      <Router />
      {
        checkAuthData.isLoading && (
          <Spin fullscreen />
        )
      }
    </ConfigProvider>
  );
}

export default App;
