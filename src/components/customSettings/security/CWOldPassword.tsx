import { motion, AnimatePresence } from "framer-motion";
import { FiLock } from "react-icons/fi";
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
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Old Password
        </label>
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
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          New Password
        </label>
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
        className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/25 transition cursor-pointer flex items-center justify-center min-w-37.5"
        onClick={handleUpdatePassword}
      >
        {pwdLoading ? <CircleLoader /> : "Change Password"}
      </motion.button>
    </>
  );
};

export default CWOldPassword;
