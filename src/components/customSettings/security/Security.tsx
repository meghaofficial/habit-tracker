import { motion } from "framer-motion";
import { useState } from "react";
import { FiKey, FiMail } from "react-icons/fi";
import { axiosPrivate } from "../../../api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { notify } from "../../../helper";
import CWOldPassword from "./CWOldPassword";
import VerifyOTP from "./VerifyOTP";
import PwdAfterOTPVerification from "./PwdAfterOTPVerification";

const Security = () => {
  const user = useSelector((state: RootState) => state.auth);
  const [changeWOtp, setChangeWOtp] = useState(false);
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [changePwdAfterVerify, setChangePwdAfterVerify] = useState(false);

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
      notify.error(
        (error as any)?.response?.data?.message ||
          "An unexpected error occurred",
      );
    } finally {
      setSendOTPLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 light:border-black/10 pb-4">
        <h3 className="text-xl font-bold text-white light:text-black">
          Security Credentials
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Update your password to keep your account secure.
        </p>
      </div>

      {/* Mode Selector Pill */}
      <div className="flex p-1 bg-slate-950/40 light:bg-black/5 border border-white/10 light:border-black/10 rounded-xl max-w-sm">
        <button
          onClick={() => setChangeWOtp(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all duration-300 relative cursor-pointer ${
            !changeWOtp
              ? "text-purple-500 light:text-purple-600 font-bold"
              : "text-slate-400 hover:text-slate-200 light:hover:text-slate-600"
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
            changeWOtp
              ? "text-purple-500 light:text-purple-600 font-bold"
              : "text-slate-400 hover:text-slate-200 light:hover:text-slate-600"
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
          <CWOldPassword />
        ) : sendOTPLoading ? (
          /* Loading OTP State */
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-400">
              Sending OTP to {user.email}...
            </p>
          </div>
        ) : changePwdAfterVerify ? (
          <PwdAfterOTPVerification setChangeWOtp={setChangeWOtp} />
        ) : (
          <VerifyOTP setChangePwdAfterVerify={setChangePwdAfterVerify} />
        )}
      </div>
    </div>
  );
};

export default Security;
