import { AnimatePresence, motion } from "framer-motion";
import CircleLoader from "../../loaders/CircleLoader";
import { useState, type Dispatch, type SetStateAction } from "react";
import { axiosPrivate } from "../../../api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { notify } from "../../../helper";
import { FiCheckCircle, FiEye, FiEyeOff, FiLock } from "react-icons/fi";

const PwdAfterOTPVerification = ({
  setChangeWOtp,
}: {
  setChangeWOtp: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useSelector((state: RootState) => state.auth);
  const [changePwdLoading, setChangePwdLoading] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

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
    <motion.div
      key="change-password"
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
        {/* Status verified */}
        <motion.div
          initial={{
            opacity: 0,
            y: 6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex items-start gap-3 rounded-xl border border-emerald-400/10 bg-emerald-500/4 px-4 py-3.5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
            <FiCheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          </div>

          <div>
            <p className="text-xs font-medium text-emerald-300">
              Account verified
            </p>

            <p className="mt-1 text-[11px] leading-5 text-zinc-600">
              Your identity has been verified. Create a new password below to
              secure your account.
            </p>
          </div>
        </motion.div>

        {/* New password */}
        <div className="rounded-2xl border border-white/6 bg-white/1.5 p-5 light:border-black/6 light:bg-black/1.5">
          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
              New Password
            </label>

            <p className="mt-1 text-[11px] text-zinc-600">
              Choose a strong password for your account.
            </p>
          </div>

          <div className="relative">
            {/* Lock */}
            <div className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-zinc-600">
              <FiLock className="h-4 w-4" />
            </div>

            <input
              type={showNewPassword ? "text" : "password"}
              className="w-full rounded-xl border border-white/[0.07] bg-zinc-950/50 py-3.5 pl-11 pr-11 text-sm font-medium text-zinc-200 outline-none transition-all duration-300 placeholder:text-zinc-700 hover:border-white/10 focus:border-indigo-400/30 focus:bg-indigo-500/2.5 focus:ring-2 focus:ring-indigo-500/10 light:border-black/8 light:bg-black/2.5 light:text-black"
              placeholder="Enter your new password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />

            {/* Eye */}
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-600 transition-colors hover:text-indigo-400"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? (
                <FiEyeOff className="h-4 w-4" />
              ) : (
                <FiEye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password strength / helper */}
          <AnimatePresence>
            {newPwd && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -4,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -4,
                }}
                className="mt-3 flex items-center gap-2 overflow-hidden"
              >
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-900">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${Math.min((newPwd.length / 12) * 100, 100)}%`,
                    }}
                    className="h-full rounded-full bg-indigo-400"
                  />
                </div>

                <span className="text-[10px] text-zinc-600">
                  {newPwd.length < 6
                    ? "Too short"
                    : newPwd.length < 10
                      ? "Good"
                      : "Strong"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reset Password action button */}
        <motion.button
          whileHover={
            !changePwdLoading && newPwd
              ? {
                  scale: 1.015,
                  boxShadow: "0 10px 30px rgba(99,102,241,0.18)",
                }
              : {}
          }
          whileTap={
            !changePwdLoading && newPwd
              ? {
                  scale: 0.98,
                }
              : {}
          }
          disabled={changePwdLoading || !newPwd}
          onClick={handleChangePassword}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
            newPwd && !changePwdLoading
              ? "border-indigo-400/20 bg-indigo-500/15 text-indigo-300 hover:border-indigo-400/30 hover:bg-indigo-500/20"
              : "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-700"
          }`}
        >
          {changePwdLoading ? (
            <CircleLoader />
          ) : (
            <>
              <FiLock className="h-3.5 w-3.5" />
              Reset Password
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PwdAfterOTPVerification;
