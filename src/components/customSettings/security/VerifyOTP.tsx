import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useState, type Dispatch, type SetStateAction } from "react";
import { axiosPrivate } from "../../../api/axios";
import { notify } from "../../../helper";
import CircleLoader from "../../loaders/CircleLoader";
import { FiCheck, FiClock, FiMail } from "react-icons/fi";

const VerifyOTP = ({
  setChangePwdAfterVerify,
}: {
  setChangePwdAfterVerify: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useSelector((state: RootState) => state.auth);
  const [otp, setOtp] = useState("");
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

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
      notify.error(
        (error as any)?.response?.data?.message ||
          "An unexpected error occurred",
      );
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  return (
    <motion.div
      key="verify-otp"
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <div className="space-y-5">
        {/* OTP Information */}
        <motion.div
          initial={{
            opacity: 0,
            y: 6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex items-start gap-3 rounded-xl border border-indigo-400/10 bg-indigo-500/4 px-4 py-3.5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
            <FiMail className="h-3.5 w-3.5 text-indigo-400" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-indigo-300">
              Verification code sent
            </p>

            <p className="mt-1 text-[11px] leading-5 text-zinc-600">
              We've sent a 6-digit OTP to{" "}
              <span className="font-medium text-zinc-400">{user.email}</span>.
            </p>

            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-700">
              <FiClock className="h-3 w-3" />
              Code expires in 10 minutes
            </div>
          </div>
        </motion.div>

        {/* OTP Input */}
        <div className="rounded-2xl border border-white/6 bg-white/1.5 p-5 light:border-black/6 light:bg-black/1.5">
          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Enter OTP Code
            </label>

            <p className="mt-1 text-[11px] text-zinc-600">
              Enter the 6-digit code we sent to your email.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* OTP input */}
            <div className="relative flex-1">
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setOtp(value);
                }}
                placeholder="000000"
                className="w-full rounded-xl border border-white/[0.07] bg-zinc-950/50 px-4 py-3.5 text-center text-lg font-bold tracking-[0.45em] text-zinc-200 outline-none transition-all duration-300 placeholder:text-zinc-700 focus:border-indigo-400/30 focus:bg-indigo-500/2.5 focus:ring-2 focus:ring-indigo-500/10 light:border-black/8 light:bg-black/2.5 light:text-black"
              />
            </div>

            {/* Verify button */}
            <motion.button
              whileHover={
                !verifyOtpLoading && otp.length >= 6
                  ? {
                      scale: 1.015,
                      boxShadow: "0 10px 30px rgba(99,102,241,0.18)",
                    }
                  : {}
              }
              whileTap={
                !verifyOtpLoading && otp.length >= 6
                  ? {
                      scale: 0.98,
                    }
                  : {}
              }
              disabled={verifyOtpLoading || otp.length < 6}
              onClick={handleVerifyOtp}
              className={`flex min-w-25 items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
                otp.length === 6 && !verifyOtpLoading
                  ? "border-indigo-400/20 bg-indigo-500/15 text-indigo-300 hover:border-indigo-400/30 hover:bg-indigo-500/20"
                  : "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-700"
              }`}
            >
              {verifyOtpLoading ? (
                <CircleLoader />
              ) : (
                <>
                  <FiCheck className="h-3.5 w-3.5" />
                  Verify
                </>
              )}
            </motion.button>
          </div>

          {/* Digit counter */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-zinc-700">
              Enter all 6 digits
            </span>

            <motion.span
              key={otp.length}
              initial={{
                opacity: 0,
                y: -2,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`text-[10px] font-medium ${
                otp.length === 6 ? "text-indigo-400" : "text-zinc-700"
              }`}
            >
              {otp.length}/6
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyOTP;
