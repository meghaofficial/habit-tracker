import { useState } from "react";
import {
  FiArrowLeft,
  FiUser,
  FiLock,
  FiCreditCard,
  FiHelpCircle,
  FiShield,
  FiChevronRight,
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
import Notification from "../customSettings/Notification";
import { FaBell } from "react-icons/fa";

const sections = [
  { name: "Profile", label: "Profile", icon: FiUser },
  { name: "Change Password", label: "Security", icon: FiLock },
  { name: "Subscription", label: "Subscription", icon: FiCreditCard },
  { name: "Notification", label: "Notification", icon: FaBell },
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
        {/* <div className="md:w-72 w-full flex flex-col gap-6">
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
                      ? "text-indigo-500 light:text-indigo-600 font-semibold"
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
                    className={`relative z-10 w-4 h-4 ${isActive ? "text-indigo-500 light:text-indigo-600" : "text-slate-400"}`}
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
                      className="absolute right-3 w-1.5 h-1.5 bg-indigo-500 rounded-full md:block hidden"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div> */}

        <div className="flex w-full flex-col gap-5 md:w-72">
          
          {/* Header */}
          <div className="flex items-center gap-3 px-1">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/")}
              className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/[0.07] bg-white/2.5 text-zinc-500 transition-all duration-300 hover:border-indigo-400/15 hover:bg-indigo-500/6 hover:text-indigo-400 light:border-black/[0.07] light:bg-black/2.5 light:text-slate-500"
              aria-label="Back to home"
            >
              <FiArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </motion.button>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white light:text-black">
                Settings
              </h2>

              <p className="mt-0.5 text-[10px] text-zinc-600">
                Manage your account
              </p>
            </div>
          </div>

          {/* User Profile */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/6 bg-white/2 p-3.5 transition-all duration-300 hover:border-indigo-400/10 light:border-black/6 light:bg-black/2">
            {/* Subtle glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-500/[0.07] blur-2xl" />

            <div className="relative z-10 flex items-center gap-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-500/10 text-sm font-bold text-indigo-300">
                  {user.username.slice(0, 1).toUpperCase()}
                </div>

                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-400 light:border-white" />
              </div>

              {/* User details */}
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-zinc-200 light:text-black">
                  {user.username}
                </h4>

                <p className="mt-0.5 truncate text-[11px] text-zinc-600">
                  {user.email}
                </p>
              </div>

              <FiChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-700" />
            </div>
          </div>

          {/* Navigations */}
          <div>
            <p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
              Account
            </p>

            <div className="relative flex w-full flex-row flex-wrap gap-1 md:flex-col md:flex-nowrap">
              {sections.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.name;

                return (
                  <motion.button
                    key={item.name}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActive(item.name)}
                    className={`group relative flex flex-1 cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-xs font-medium transition-all duration-300 md:flex-initial ${
                      isActive
                        ? "text-indigo-300"
                        : "text-zinc-600 hover:bg-white/2.5 hover:text-zinc-300 light:text-slate-500 light:hover:bg-black/2.5 light:hover:text-slate-800"
                    }`}
                  >
                    {/* Active background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSettingsBackground"
                        className="absolute inset-0 rounded-xl border border-indigo-400/10 bg-indigo-500/[0.07]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Active left indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSettingsIndicator"
                        className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-indigo-400"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <span
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "bg-transparent text-zinc-700 group-hover:text-zinc-400"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>

                    {/* Label */}
                    <span className="relative z-10 hidden truncate sm:inline md:inline">
                      {item.label}
                    </span>

                    <span className="relative z-10 inline truncate sm:hidden md:hidden">
                      {item.label.split(" ")[0]}
                    </span>

                    {/* Active arrow */}
                    {isActive && (
                      <motion.span
                        initial={{
                          opacity: 0,
                          x: -4,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        className="relative z-10 ml-auto hidden md:block"
                      >
                        <FiChevronRight className="h-3 w-3 text-indigo-400/70" />
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Security Message - Footer */}
          <div className="mt-auto hidden rounded-xl border border-white/5 bg-white/1.5 p-3.5 md:block light:border-black/5 light:bg-black/1.5">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/6 text-indigo-400">
                <FiShield className="h-3.5 w-3.5" />
              </div>

              <div>
                <p className="text-[10px] font-medium text-zinc-500">
                  Your account is protected
                </p>

                <p className="mt-1 text-[9px] leading-4 text-zinc-700">
                  Keep your account details and credentials secure.
                </p>
              </div>
            </div>
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
              {active === "Notification" && <Notification />}
              {active === "Help" && <Help />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Settings;
