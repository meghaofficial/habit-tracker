import Logo from "./Logo";
import CustomButton from "./CutomButton";
import { useEffect, useState } from "react";
import { LuSunMedium, LuSunMoon } from "react-icons/lu";
import type { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { IoMdLogIn } from "react-icons/io";
import AuthForm from "../auth/AuthForm";

const NavigationBar = () => {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const isLogin = useSelector((state: RootState) => state.auth.username !== "");
  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    const root = window.document.documentElement;

    if (newTheme) {
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light");
      localStorage.setItem("theme", "light");
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
      <Logo />
      <div className="flex items-center gap-4">
        <CustomButton onClick={toggleTheme} type="transparent">
          <div className="flex items-center gap-1">
            {dark ? <LuSunMoon /> : <LuSunMedium />}
            <span className="sm:block hidden">
              {dark ? "Dark Theme" : "Light Theme"}
            </span>
          </div>
        </CustomButton>
        <CustomButton
          onClick={() => {
            if (!isLogin) setOpen(true);
          }}
        >
          <div className="flex items-center gap-1">
            <span className="sm:block hidden">Login</span>
            <IoMdLogIn />
          </div>
        </CustomButton>
      </div>
      <AuthForm open={open} setOpen={setOpen} />
    </>
  );
};

export default NavigationBar;
