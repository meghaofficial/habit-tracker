import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useState, type Dispatch, type SetStateAction } from "react";
import { axiosPrivate } from "../../../api/axios";
import { notify } from "../../../helper";
import CircleLoader from "../../loaders/CircleLoader";

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
    <div className="space-y-4">
      <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs rounded-xl flex items-start gap-2">
        <span className="mt-0.5">📧</span>
        <span>
          An OTP code has been sent to **{user.email}**. It will be valid for 10
          minutes.
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          OTP Code
        </label>
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
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/25 transition cursor-pointer flex items-center justify-center min-w-25"
            onClick={handleVerifyOtp}
          >
            {verifyOtpLoading ? <CircleLoader /> : "Verify"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
