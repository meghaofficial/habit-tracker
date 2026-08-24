import { useState } from "react";
import {
  FiArrowLeft,
  FiUser,
  FiLock,
  FiCreditCard,
  FiHelpCircle,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "../../redux/store/store";
import NavigationBar from "../shared/NavigationBar";
import Profile from "../customSettings/Profile";
import Security from "../customSettings/security/Security";
import Subscription from "../customSettings/subscription/Subscription";
import Help from "../customSettings/Help";

const sections = [
  { name: "Profile", label: "Profile", icon: FiUser },
  { name: "Change Password", label: "Security", icon: FiLock },
  { name: "Subscription", label: "Subscription", icon: FiCreditCard },
  { name: "Help", label: "Help & Support", icon: FiHelpCircle },
];

const Settings = () => {
  
  const [active, setActive] = useState("Profile");
  const user = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  return (
    <>
      <nav className="flex justify-between items-center py-5 sm:pt-5 mt-4 w-full px-5">
        <NavigationBar />
      </nav>
      <div className="min-h-screen flex md:flex-row flex-col google-sans p-2 px-5 pb-8 gap-8">
        {/* Sidebar Container */}
        <div className="md:w-72 w-full flex flex-col gap-6">
          {/* Back button and title */}
          <div className="flex items-center gap-3 px-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 light:bg-white light:border-black/10 light:text-black transition cursor-pointer"
            >
              <FiArrowLeft className="w-5 h-5" />
            </motion.button>
            <h2 className="text-2xl font-bold tracking-tight text-white light:text-black">
              Settings
            </h2>
          </div>

          {/* User profile card inside sidebar */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 light:bg-white light:border-black/10 shadow-md">
            <div className="h-12 w-12 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-purple-500/20">
              {user.username.slice(0, 1).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm truncate text-white light:text-black">
                {user.username}
              </h4>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="flex md:flex-col flex-row flex-wrap md:flex-nowrap w-full gap-2 p-1.5 bg-slate-950/40 border border-white/5 light:bg-black/5 light:border-black/5 rounded-2xl">
            {sections.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActive(item.name)}
                  className={`relative flex-1 md:flex-initial flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-purple-500 light:text-purple-600 font-semibold"
                      : "text-slate-400 hover:text-slate-200 light:hover:text-slate-800 hover:bg-white/5 light:hover:bg-slate-100"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white/10 light:bg-white border border-white/10 light:border-black/5 shadow-sm rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={`relative z-10 w-4 h-4 ${isActive ? "text-purple-500 light:text-purple-600" : "text-slate-400"}`}
                  />
                  <span className="relative z-10 hidden sm:inline md:inline">
                    {item.label}
                  </span>
                  <span className="relative z-10 inline sm:hidden md:hidden">
                    {item.label.split(" ")[0]}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      className="absolute right-3 w-1.5 h-1.5 bg-purple-500 rounded-full md:block hidden"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 min-h-125 flex flex-col bg-white/5 border border-white/10 light:bg-white light:border-black/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          {/* Decorative background glow inside the content pane */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full flex-1 flex flex-col relative z-10"
            >
              {active === "Profile" && <Profile />}
              {active === "Change Password" && <Security />}
              {active === "Subscription" && <Subscription />}
              {active === "Help" && <Help />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Settings;
