import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import CircleLoader from "../../loaders/CircleLoader";
import { useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import { notify } from "../../../helper";
import { useDispatch } from "react-redux";
import { setCreds } from "../../../redux/slices/authSlice";
import type { AxiosError } from "axios";

const CWOldPassword = () => {
  const [pwds, setPwds] = useState({
    old: "",
    new: "",
  });
  const [errMsg, setErrMsg] = useState<{
    oldPwdErr: string;
    newPwdErr: string;
  }>({
    oldPwdErr: "",
    newPwdErr: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const dispatch = useDispatch();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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

  return (
    <>
      <motion.div
        key="old-password"
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -8,
        }}
        transition={{
          duration: 0.25,
        }}
      >
        <div className="space-y-5">
          {/* Current Pwd */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Current Password
              </label>
              <span className="text-[10px] text-zinc-700">Required</span>
            </div>

            <div className="relative">
              {/* Lock icon */}
              <div className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-zinc-600">
                <FiLock className="h-4 w-4" />
              </div>

              <input
                type={showOldPassword ? "text" : "password"}
                className="w-full rounded-xl border border-white/[0.07] bg-zinc-950/50 py-3.5 pl-11 pr-11 text-sm font-medium text-zinc-200 outline-none transition-all duration-300 placeholder:text-zinc-700 hover:border-white/10 focus:border-indigo-400/30 focus:bg-indigo-500/2.5 focus:ring-2 focus:ring-indigo-500/10 light:border-black/8 light:bg-black/2.5 light:text-black"
                placeholder="Enter your current password"
                value={pwds.old}
                onChange={(e) => {
                  setPwds((prev) => ({
                    ...prev,
                    old: e.target.value,
                  }));
                  setErrMsg((prev) => ({
                    ...prev,
                    oldPwdErr: "",
                  }));
                }}
              />

              {/* Eye */}
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-600 transition-colors hover:text-indigo-400"
                aria-label={
                  showOldPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showOldPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>

              {/* Error */}
              <AnimatePresence>
                {errMsg.oldPwdErr && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                    }}
                    className="mt-2 flex items-center gap-1.5 text-[11px] text-red-400"
                  >
                    <span>⚠️</span>
                    {errMsg.oldPwdErr}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2.5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                New Password
              </label>

              <p className="mt-1 text-[11px] text-zinc-600">
                Choose a strong password you haven't used before.
              </p>
            </div>

            <div className="relative">
              {/* Lock icon */}
              <div className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-zinc-600">
                <FiLock className="h-4 w-4" />
              </div>

              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full rounded-xl border border-white/[0.07] bg-zinc-950/50 py-3.5 pl-11 pr-11 text-sm font-medium text-zinc-200 outline-none transition-all duration-300 placeholder:text-zinc-700 hover:border-white/10 focus:border-indigo-400/30 focus:bg-indigo-500/2.5 focus:ring-2 focus:ring-indigo-500/10 light:border-black/8 light:bg-black/2.5 light:text-black"
                placeholder="Enter your new password"
                value={pwds.new}
                onChange={(e) => {
                  setPwds((prev) => ({
                    ...prev,
                    new: e.target.value,
                  }));

                  setErrMsg((prev) => ({
                    ...prev,
                    newPwdErr: "",
                  }));
                }}
              />

              {/* Eye */}
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-600 transition-colors hover:text-indigo-400"
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
              >
                {showNewPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>

              {/* Error */}
              <AnimatePresence>
                {errMsg.newPwdErr && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                    }}
                    className="mt-2 flex items-center gap-1.5 text-[11px] text-red-400"
                  >
                    <span>⚠️</span>
                    {errMsg.newPwdErr}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-1">
            <motion.button
              whileHover={
                !pwdLoading
                  ? {
                      scale: 1.015,
                      boxShadow: "0 10px 30px rgba(99,102,241,0.18)",
                    }
                  : {}
              }
              whileTap={
                !pwdLoading
                  ? {
                      scale: 0.98,
                    }
                  : {}
              }
              disabled={pwdLoading}
              onClick={handleUpdatePassword}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/15 px-6 py-3.5 text-sm font-semibold text-indigo-300 transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-40"
            >
              {pwdLoading ? (
                <CircleLoader />
              ) : (
                <>
                  <FiLock className="h-3.5 w-3.5" />
                  Change Password
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CWOldPassword;
