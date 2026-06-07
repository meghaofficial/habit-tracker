import CustomButton from "./CutomButton";
import { useEffect, useState } from "react";
import { LuSunMedium, LuSunMoon } from "react-icons/lu";
import type { RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import AuthForm from "../auth/AuthForm";
import { axiosPrivate } from "../../api/axios";
import { removeCreds } from "../../redux/slices/authSlice";
import { notify } from "../../helper";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { IoSettingsSharp } from "react-icons/io5";
import { setTheme } from "../../redux/slices/themeSlice";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
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
    setLogoutLoading(true);
    try {
      const res = await axiosPrivate.post("/logout");

      if (res?.data?.success) {
        dispatch(removeCreds());
      }
    } catch (error) {
      console.error(error);
      notify.error("Logout failed. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <Logo />
      </div>
      <div className="flex items-center gap-4">
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
        <CustomButton onClick={toggleTheme} type="transparent">
          <div className="flex items-center gap-1">
            {theme.theme === "dark" ? <LuSunMoon /> : <LuSunMedium />}
            <span className="sm:block hidden">
              {theme.theme === "dark" ? "Dark Theme" : "Light Theme"}
            </span>
          </div>
        </CustomButton>
        <CustomButton
          onClick={() => {
            if (!isLogin) setOpen(true);
            else handleLogout();
          }}
        >
          {/* {logoutLoading ? <CircleLoader /> : "Logout"} */}
          <div className="flex items-center gap-1">
            <span className="sm:block hidden">
              {!isLogin ? "Login" : "Logout"}
            </span>
            {isLogin ? <IoMdLogOut /> : <IoMdLogIn />}
          </div>
        </CustomButton>
      </div>
      <AuthForm open={open} setOpen={setOpen} />
    </>
  );
};

export default NavigationBar;
