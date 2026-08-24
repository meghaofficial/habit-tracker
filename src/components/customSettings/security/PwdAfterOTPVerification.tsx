import { motion } from "framer-motion";
import { FiLock } from "react-icons/fi";
import CircleLoader from "../../loaders/CircleLoader";
import { useState, type Dispatch, type SetStateAction } from "react";
import { axiosPrivate } from "../../../api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { notify } from "../../../helper";

const PwdAfterOTPVerification = ({
  setChangeWOtp,
}: {
  setChangeWOtp: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useSelector((state: RootState) => state.auth);
  const [changePwdLoading, setChangePwdLoading] = useState(false);
  const [newPwd, setNewPwd] = useState("");

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
      notify.error(
        (error as any)?.response?.data?.message ||
          "An unexpected error occurred",
      );
    } finally {
      setChangePwdLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl flex items-start gap-2">
        <span className="mt-0.5">ℹ️</span>
        <span>
          Account verified. Please enter and submit your new password below. Do
          not close this page.
        </span>
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
  );
};

export default PwdAfterOTPVerification;
