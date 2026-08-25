import { motion } from "framer-motion";
import { useState } from "react";
import { FiKey, FiMail, FiShield } from "react-icons/fi";
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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-white/6 pb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10">
          <FiShield className="h-4 w-4 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white light:text-black">
            Security Credentials
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Update your password to keep your account secure.
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
            Verification Method
          </p>
          <p className="mt-1 text-[11px] text-zinc-600">
            Choose how you'd like to verify your identity.
          </p>
        </div>

        {/* Old Pwd & OTP Code nav buttons */}
        <div className="relative flex max-w-md gap-1 rounded-2xl border border-white/6 bg-zinc-950/50 p-1.5 light:border-black/8 light:bg-black/3">
          <button
            type="button"
            onClick={() => setChangeWOtp(false)}
            className={`relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-300 ${
              !changeWOtp
                ? "text-indigo-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {!changeWOtp && (
              <motion.div
                layoutId="passwordModePill"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                className="absolute inset-0 rounded-xl border border-indigo-400/10 bg-indigo-500/8 shadow-[0_0_20px_rgba(99,102,241,0.05)]"
              />
            )}
            <FiKey className="relative z-10 h-3.5 w-3.5" />
            <span className="relative z-10 whitespace-nowrap">
              Old Password
            </span>
          </button>

          <button
            type="button"
            disabled={sendOTPLoading}
            onClick={() => {
              if (sendOTPLoading) return;

              setChangeWOtp(true);
              handleSendOtp();
            }}
            className={`relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              changeWOtp
                ? "text-indigo-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {changeWOtp && (
              <motion.div
                layoutId="passwordModePill"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                className="absolute inset-0 rounded-xl border border-indigo-400/10 bg-indigo-500/8 shadow-[0_0_20px_rgba(99,102,241,0.05)]"
              />
            )}
            <FiMail className="relative z-10 h-3.5 w-3.5" />
            <span className="relative z-10 whitespace-nowrap">OTP Code</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <motion.div layout className="max-w-md">
        {!changeWOtp ? (
          <CWOldPassword />
        ) : 
        sendOTPLoading ? (
          <motion.div
            key="sending-otp"
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex flex-col items-center justify-center rounded-2xl border border-white/6 bg-white/1.5 px-6 py-12 light:border-black/6 light:bg-black/1.5"
          >
            {/* Animated loader */}
            <div className="relative flex h-12 w-12 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/10" />

              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-400" />

              <FiMail className="h-4 w-4 text-indigo-400" />
            </div>

            <p className="mt-5 text-sm font-medium text-zinc-300">
              Sending verification code
            </p>

            <p className="mt-1 text-center text-xs leading-5 text-zinc-600">
              We're sending an OTP to
              <br />
              <span className="text-zinc-500">{user.email}</span>
            </p>
          </motion.div>
        ) : 
        changePwdAfterVerify ? 
        (
          <PwdAfterOTPVerification setChangeWOtp={setChangeWOtp} />
        ) : 
        (
          <VerifyOTP setChangePwdAfterVerify={setChangePwdAfterVerify} />
        )}
      </motion.div>

      {/* Security Info */}
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.2,
        }}
        className="flex max-w-md items-start gap-3 rounded-xl border border-indigo-400/10 bg-indigo-500/3 px-4 py-3.5"
      >
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
          <FiShield className="h-3.5 w-3.5 text-indigo-400" />
        </div>

        <div>
          <p className="text-xs font-medium text-indigo-300">
            Keep your account secure
          </p>

          <p className="mt-1 text-[11px] leading-5 text-zinc-600">
            Never share your password or verification code with anyone. We will
            never ask for your OTP.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Security;
