import { useState } from "react";
import { FiArrowLeft, FiUser, FiLock, FiCreditCard, FiHelpCircle, FiEdit2, FiX, FiMail, FiKey } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "../../redux/store/store";
import { axiosPrivate } from "../../api/axios";
import { notify } from "../../helper";
import { setCreds } from "../../redux/slices/authSlice";
import type { AxiosError } from "axios";
import CircleLoader from "../loaders/CircleLoader";
import NavigationBar from "../shared/NavigationBar";
import Subscription from "../profile/Subscription";

const sections = [
  { name: "Profile", label: "Profile", icon: FiUser },
  { name: "Change Password", label: "Security", icon: FiLock },
  { name: "Subscription", label: "Subscription", icon: FiCreditCard },
  { name: "Help", label: "Help & Support", icon: FiHelpCircle },
];

const Settings = () => {
  const [active, setActive] = useState("Profile");
  const [editing, setEditing] = useState(false);
  const user = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [unameLoading, setUnameLoading] = useState(false);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const [pwds, setPwds] = useState({
    old: "",
    new: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<{
    usernameErr: string;
    oldPwdErr: string;
    newPwdErr: string;
  }>({
    usernameErr: "",
    oldPwdErr: "",
    newPwdErr: "",
  });
  const [changeWOtp, setChangeWOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [changePwdAfterVerify, setChangePwdAfterVerify] = useState(false);
  const [changePwdLoading, setChangePwdLoading] = useState(false);
  const [newPwd, setNewPwd] = useState("");

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      setErrMsg((prev) => ({
        ...prev,
        usernameErr: "Username cannot be empty",
      }));
      return;
    }
    setUnameLoading(true);
    try {
      const res = await axiosPrivate.patch("/update-username", {
        new_username: username,
      });

      if (res?.data?.success) {
        notify.success("Username changed successfully");
        setEditing(false);
        dispatch(setCreds({ username: res?.data?.user?.username }));
      }
    } catch {
      notify.error("Please try again.");
    } finally {
      setErrMsg((prev) => ({ ...prev, usernameErr: "" }));
      setUnameLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!pwds.old.trim() || !pwds.new.trim()) {
      setErrMsg((prev) => ({
        ...prev,
        oldPwdErr: !pwds.old.trim() ? "This field is required" : "",
        newPwdErr: !pwds.new.trim() ? "This field is required" : "",
      }));
      return;
    }
    setPwdLoading(true);
    try {
      const res = await axiosPrivate.patch("/change-password", {
        old_password: pwds.old,
        new_password: pwds.new,
      });

      if (res?.data?.success) {
        notify.success("Passwords change successfully");
        dispatch(setCreds({ username: res?.data?.user?.username }));
        setPwds({ old: "", new: "" });
      } else {
        notify.error(res?.data?.message);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;

      notify.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setSendOTPLoading(true);
    try {
      const res = await axiosPrivate.post("/forgot-password", {
        email: user.email,
      });
      if (res.data.success) {
        notify.success(res.data.message);
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notify.error(
        (error as any)?.response?.data?.message ||
          "An unexpected error occurred",
      );
    } finally {
      setSendOTPLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifyOtpLoading(true);
    try {
      const res = await axiosPrivate.post("/verify-change-pwd-otp", {
        email: user.email,
        enteredOTP: otp,
      });
      if (res.data.success) {
        notify.success(res.data.message);
        setChangePwdAfterVerify(true);
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notify.error(
        (error as any)?.response?.data?.message ||
          "An unexpected error occurred",
      );
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setChangePwdLoading(true);
    try {
      const res = await axiosPrivate.post("/reset-password", {
        email: user.email,
        new_password: newPwd,
      });
      if (res.data.success) {
        notify.success(res.data.message);
        setChangeWOtp(false);
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notify.error(
        (error as any)?.response?.data?.message ||
          "An unexpected error occurred",
      );
    } finally {
      setChangePwdLoading(false);
    }
  };

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
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-purple-500/20">
              {user.username.slice(0, 1).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm truncate text-white light:text-black">{user.username}</h4>
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
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`relative z-10 w-4 h-4 ${isActive ? "text-purple-500 light:text-purple-600" : "text-slate-400"}`} />
                  <span className="relative z-10 hidden sm:inline md:inline">{item.label}</span>
                  <span className="relative z-10 inline sm:hidden md:hidden">{item.label.split(" ")[0]}</span>
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
        <div className="flex-1 min-h-[500px] flex flex-col bg-white/5 border border-white/10 light:bg-white light:border-black/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
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
              {/* PROFILE */}
              {active === "Profile" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/10 light:border-black/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white light:text-black">Profile Details</h3>
                      <p className="text-xs text-slate-400 mt-1">Manage your basic account details here.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setEditing(!editing);
                        if (!editing) setUsername(user.username);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition duration-300 cursor-pointer ${
                        editing
                          ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30"
                          : "bg-white/5 hover:bg-white/10 text-white light:text-slate-700 light:bg-black/5 light:hover:bg-black/10 border-white/10 light:border-black/10"
                      }`}
                    >
                      {editing ? (
                        <>
                          <FiX className="w-3.5 h-3.5" /> Cancel
                        </>
                      ) : (
                        <>
                          <FiEdit2 className="w-3.5 h-3.5" /> Edit
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="space-y-6 max-w-lg mt-4">
                    {/* Username Field */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
                      {editing ? (
                        <div className="flex sm:flex-row flex-col items-stretch sm:items-center gap-3">
                          <div className="relative flex-1">
                            <input
                              className="w-full text-sm bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-xl p-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 light:placeholder:text-gray-400 text-white light:text-black transition-all duration-300"
                              placeholder={user?.username}
                              value={username}
                              onChange={(e) => {
                                setUsername(e.target.value);
                                setErrMsg((prev) => ({
                                  ...prev,
                                  usernameErr: "",
                                }));
                              }}
                            />
                            <AnimatePresence>
                              {errMsg.usernameErr && (
                                <motion.p
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="absolute text-[11px] text-red-500 mt-1 flex items-center gap-1"
                                >
                                  <span>⚠️</span> {errMsg.usernameErr}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={unameLoading}
                            className="px-6 py-3 text-sm bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/25 transition cursor-pointer flex items-center justify-center min-w-[80px]"
                            onClick={handleUpdateUsername}
                          >
                            {unameLoading ? <CircleLoader /> : "Save"}
                          </motion.button>
                        </div>
                      ) : (
                        <div className="p-3 bg-white/5 border border-white/5 light:bg-black/5 light:border-black/5 rounded-xl text-white light:text-black text-sm font-medium">
                          {user?.username}
                        </div>
                      )}
                    </div>

                    {/* Email Field (Always Read Only) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <span className="text-[10px] bg-slate-800 light:bg-black/5 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-white/5 light:border-black/5">
                          Read Only
                        </span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 light:bg-black/5 light:border-black/5 rounded-xl text-white/60 light:text-black/60 text-sm font-medium flex items-center justify-between">
                        <span>{user?.email}</span>
                        <FiLock className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY */}
              {active === "Change Password" && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 light:border-black/10 pb-4">
                    <h3 className="text-xl font-bold text-white light:text-black">Security Credentials</h3>
                    <p className="text-xs text-slate-400 mt-1">Update your password to keep your account secure.</p>
                  </div>

                  {/* Mode Selector Pill */}
                  <div className="flex p-1 bg-slate-950/40 light:bg-black/5 border border-white/10 light:border-black/10 rounded-xl max-w-sm">
                    <button
                      onClick={() => setChangeWOtp(false)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all duration-300 relative cursor-pointer ${
                        !changeWOtp ? "text-purple-500 light:text-purple-600 font-bold" : "text-slate-400 hover:text-slate-200 light:hover:text-slate-600"
                      }`}
                    >
                      {!changeWOtp && (
                        <motion.div
                          layoutId="passwordModePill"
                          className="absolute inset-0 bg-white/10 light:bg-white border border-white/10 light:border-slate-200 shadow-sm rounded-lg"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <FiKey className="relative z-10 w-3.5 h-3.5" />
                      <span className="relative z-10">Use Old Password</span>
                    </button>
                    <button
                      onClick={() => {
                        if (sendOTPLoading) return;
                        setChangeWOtp(true);
                        handleSendOtp();
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all duration-300 relative cursor-pointer ${
                        changeWOtp ? "text-purple-500 light:text-purple-600 font-bold" : "text-slate-400 hover:text-slate-200 light:hover:text-slate-600"
                      }`}
                    >
                      {changeWOtp && (
                        <motion.div
                          layoutId="passwordModePill"
                          className="absolute inset-0 bg-white/10 light:bg-white border border-white/10 light:border-slate-200 shadow-sm rounded-lg"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <FiMail className="relative z-10 w-3.5 h-3.5" />
                      <span className="relative z-10">Use OTP Code</span>
                    </button>
                  </div>

                  {/* Form fields depending on selected mode */}
                  <div className="max-w-md space-y-5">
                    {!changeWOtp ? (
                      /* Old Password Flow */
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Old Password</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3.5 text-slate-400">
                              <FiLock className="w-4 h-4" />
                            </span>
                            <input
                              type="password"
                              className="w-full text-sm bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-xl p-3 pl-10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white light:text-black transition-all duration-300"
                              placeholder="Enter current password"
                              value={pwds.old}
                              onChange={(e) => {
                                setPwds((prev) => ({
                                  ...prev,
                                  old: e.target.value,
                                }));
                                setErrMsg((prev) => ({ ...prev, oldPwdErr: "" }));
                              }}
                            />
                            <AnimatePresence>
                              {errMsg.oldPwdErr && (
                                <motion.p
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="text-[11px] text-red-500 mt-1 flex items-center gap-1"
                                >
                                  <span>⚠️</span> {errMsg.oldPwdErr}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3.5 text-slate-400">
                              <FiLock className="w-4 h-4" />
                            </span>
                            <input
                              type="password"
                              className="w-full text-sm bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-xl p-3 pl-10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white light:text-black transition-all duration-300"
                              placeholder="Enter new password"
                              value={pwds.new}
                              onChange={(e) => {
                                setPwds((prev) => ({
                                  ...prev,
                                  new: e.target.value,
                                }));
                                setErrMsg((prev) => ({ ...prev, newPwdErr: "" }));
                              }}
                            />
                            <AnimatePresence>
                              {errMsg.newPwdErr && (
                                <motion.p
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="text-[11px] text-red-500 mt-1 flex items-center gap-1"
                                >
                                  <span>⚠️</span> {errMsg.newPwdErr}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={pwdLoading}
                          className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/25 transition cursor-pointer flex items-center justify-center min-w-[150px]"
                          onClick={handleUpdatePassword}
                        >
                          {pwdLoading ? <CircleLoader /> : "Change Password"}
                        </motion.button>
                      </>
                    ) : sendOTPLoading ? (
                      /* Loading OTP State */
                      <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                        <p className="text-sm text-slate-400">Sending OTP to {user.email}...</p>
                      </div>
                    ) : changePwdAfterVerify ? (
                      /* OTP Verified, Enter New Password Flow */
                      <div className="space-y-4">
                        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl flex items-start gap-2">
                          <span className="mt-0.5">ℹ️</span>
                          <span>Account verified. Please enter and submit your new password below. Do not close this page.</span>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3.5 text-slate-400">
                              <FiLock className="w-4 h-4" />
                            </span>
                            <input
                              type="password"
                              className="w-full text-sm bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-xl p-3 pl-10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white light:text-black transition-all duration-300"
                              placeholder="Enter new password"
                              value={newPwd}
                              onChange={(e) => setNewPwd(e.target.value)}
                            />
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={changePwdLoading || !newPwd}
                          className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white rounded-xl font-semibold shadow-lg shadow-green-600/25 transition cursor-pointer flex items-center justify-center"
                          onClick={handleChangePassword}
                        >
                          {changePwdLoading ? <CircleLoader /> : "Reset Password"}
                        </motion.button>
                      </div>
                    ) : (
                      /* Enter & Verify OTP Flow */
                      <div className="space-y-4">
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs rounded-xl flex items-start gap-2">
                          <span className="mt-0.5">📧</span>
                          <span>An OTP code has been sent to **{user.email}**. It will be valid for 10 minutes.</span>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OTP Code</label>
                          <div className="flex gap-3">
                            <input
                              className="flex-1 text-sm bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-xl p-3 tracking-widest text-center font-bold text-white light:text-black focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                              placeholder="000000"
                              maxLength={6}
                              value={otp}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                setOtp(value);
                              }}
                            />
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              disabled={verifyOtpLoading || otp.length < 6}
                              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/25 transition cursor-pointer flex items-center justify-center min-w-[100px]"
                              onClick={handleVerifyOtp}
                            >
                              {verifyOtpLoading ? <CircleLoader /> : "Verify"}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBSCRIPTION */}
              {active === "Subscription" && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 light:border-black/10 pb-4">
                    <h3 className="text-xl font-bold text-white light:text-black">Billing & Subscriptions</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage your premium membership plans and history.</p>
                  </div>
                  <div className="mt-4">
                    <Subscription />
                  </div>
                </div>
              )}

              {/* HELP */}
              {active === "Help" && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 light:border-black/10 pb-4">
                    <h3 className="text-xl font-bold text-white light:text-black">Help & Support</h3>
                    <p className="text-xs text-slate-400 mt-1">Need help? We're here for you.</p>
                  </div>

                  <div className="max-w-md bg-white/5 border border-white/10 light:bg-black/5 light:border-black/10 rounded-2xl p-6 mt-4 space-y-4">
                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-xl flex items-center justify-center">
                      <FiHelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white light:text-black text-base">Contact Our Team</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Have questions, bug reports, or feature suggestions? Send us an email and we'll get back to you as soon as possible.
                      </p>
                    </div>
                    <div className="pt-2">
                      <a
                        href="mailto:habitify@habitflow.ai"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                      >
                        <FiMail className="w-4 h-4" />
                        <span>habitify@habitflow.ai</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Settings;

