import CustomButton from "./CutomButton";
import { LuSunMedium, LuSunMoon } from "react-icons/lu";
import type { RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { axiosPrivate } from "../../api/axios";
import { removeCreds } from "../../redux/slices/authSlice";
import { notify } from "../../helper";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { IoSettingsSharp } from "react-icons/io5";
import { setTheme } from "../../redux/slices/themeSlice";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = useSelector((state: RootState) => state.auth.username !== "");
  const theme = useSelector((state: RootState) => state.theme);

  const toggleTheme = () => {
    const newTheme = theme.theme === "dark" ? "light" : "dark";
    dispatch(setTheme({ theme: newTheme }));
    const root = window.document.documentElement;

    if (newTheme === "dark") {
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axiosPrivate.post("/logout");

      if (res?.data?.success) {
        dispatch(removeCreds());
      }
    } catch (error) {
      console.error(error);
      notify.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <Logo />
      </div>
      <div className="flex items-center gap-4">
        {isLogin && location.pathname !== "/settings" && (
          <CustomButton
            styling="cursor-pointer"
            onClick={() => navigate("/settings")}
            type="white"
          >
            <div className="flex items-center gap-1">
              <IoSettingsSharp />
              <span className="sm:block hidden">Settings</span>
            </div>
          </CustomButton>
        )}
        {/* <CustomButton onClick={toggleTheme} type="transparent">
          <div className="flex items-center gap-1">
            {theme.theme === "dark" ? <LuSunMoon /> : <LuSunMedium />}
            <span className="sm:block hidden">
              {theme.theme === "dark" ? "Dark Theme" : "Light Theme"}
            </span>
          </div>
        </CustomButton> */}
        <CustomButton
          onClick={() => {
            if (!isLogin) navigate("/login");
            else handleLogout();
          }}
        >
          <div className="flex items-center gap-1">
            <span className="sm:block hidden">
              {!isLogin ? "Login" : "Logout"}
            </span>
            {isLogin ? <IoMdLogOut /> : <IoMdLogIn />}
          </div>
        </CustomButton>
      </div>
    </>
  );
};

export default NavigationBar;
