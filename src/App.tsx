import { Route, Routes } from "react-router-dom";
import "./App.css";
import PageNotFound from "./components/shared/PageNotFound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "./redux/store/store";
import Demo from "./components/pages/Demo";
import Dashboard from "./components/pages/Dashboard";
import HomePage from "./components/pages/HomePage";
import { refreshAccessToken } from "./api/axios";
import { removeCreds, setCreds } from "./redux/slices/authSlice";
import PageLoader from "./components/loaders/PageLoader";
import { ToastContainer } from "react-toastify";
import Settings from "./components/pages/Settings";
import { socket } from "./socket/socket";
import { setTheme } from "./redux/slices/themeSlice";

function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector(
    (state: RootState) => state.auth.accessToken !== "",
  );
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth);
  const theme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
  }, []);

  useEffect(() => {
    setIsAuthLoading(true);
    const initAuth = async () => {
      try {
        const data = await refreshAccessToken();

        if (data?.success) {
          const accessToken = data?.accessToken;
          const { username, email, id } = data?.user || {};
          dispatch(setCreds({ username, email, id, accessToken }));
        } else {
          dispatch(removeCreds());
        }
      } catch (err) {
        console.log("User not logged in", err);
        dispatch(removeCreds());
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      socket.connect();
      socket.emit("join-user", user.id);
    }

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10 opacity-[0.6] blur-[80px]">
        <div
          className="absolute rounded-1/2 -top-[25%] -left-[15%] w-[50vw] h-[50vh]"
          style={{
            background: `radial-gradient(circle, #6365f1d4 0%, rgba(0,0,0,0) 70%)`,
            animation: `floatAround 25s infinite alternate ease-in-out`,
            mixBlendMode: "screen",
          }}
        ></div>
        <div
          className="absolute rounded-1/2 -top-[15%] -right-[15%] w-[45vw] h-[45vh]"
          style={{
            background: `radial-gradient(circle, #a955f77f 0%, rgba(0,0,0,0) 70%)`,
            animation: `floatAround 30s infinite alternate-reverse ease-in-out`,
            mixBlendMode: "screen",
          }}
        ></div>
      </div>
      <div className="main-content light:bg-[#F5F5F6]">
        {isAuthLoading ? (
          <div className="flex items-center justify-center h-screen">
            <PageLoader />
          </div>
        ) : (
          <div className="text-darkText light:text-lightText">
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              <Route
                path="/"
                element={isLogin ? <Dashboard /> : <HomePage />}
              />
              <Route path="/demo" element={<Demo />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </div>
        )}

        {/* <FloatingActionButtonComp /> */}
      </div>
    </>
  );
}

export default App;
