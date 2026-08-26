import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setCreds } from "../../redux/slices/authSlice";
import { axiosPublic } from "../../api/axios";
import CircleLoader from "../loaders/CircleLoader";
import { notify } from "../../helper";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

const AuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
    newPwd: "",
  });
  const dispatch = useDispatch();
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeInterface, setActiveInterface] = useState("login");
  const [openOTP, setOpenOTP] = useState(false); // while signup
  const [forgotSteps, setForgotSteps] = useState("0");
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [changePwdLoading, setChangePwdLoading] = useState(false);

  const handleSignup = async () => {
    setSignupLoading(true);
    try {
      const { username, email, password } = formData;
      if (!username || !email || !password) return;

      const res = await axiosPublic.post("/signup", {
        username,
        email,
        password,
      });

      if (res?.data?.success) {
        notify.success(res?.data?.message);
        if (!openOTP) setOpenOTP(true);
      }
    } catch (error) {
      notify.error((error as any).response.data.message);
    } finally {
      setSignupLoading(false);
    }
  };
  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      const { email, password } = formData;
      if (!email || !password) return;

      const res = await axiosPublic.post("/login", { email, password });

      if (res?.data?.success) {
        const accessToken = res?.data?.accessToken;
        const { username, email, id } = res?.data?.user;
        dispatch(setCreds({ username, email, id, accessToken }));
        setFormData({
          username: "",
          email: "",
          password: "",
          otp: "",
          newPwd: "",
        });
        // setOpen(false);
      } else {
        notify.error(res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        notify.error(error.response?.data.message);
      }
    } finally {
      setLoginLoading(false);
    }
  };
  const handleSendOtp = async () => {
    setSendOTPLoading(true);
    try {
      const res = await axiosPublic.post("/forgot-password", {
        email: formData.email,
      });
      if (res.data.success) {
        setForgotSteps("2");
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
  const handleVerifyOtp = async () => {
    setVerifyOtpLoading(true);
    try {
      const res = await axiosPublic.post("/verify-change-pwd-otp", {
        email: formData.email,
        enteredOTP: formData.otp,
      });
      if (res.data.success) {
        setForgotSteps("3");
        notify.success(res.data.message);
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
  const handleChangePassword = async () => {
    setChangePwdLoading(true);
    try {
      const res = await axiosPublic.post("/reset-password", {
        email: formData.email,
        new_password: formData.newPwd,
      });
      if (res.data.success) {
        setActiveInterface("login");
        setForgotSteps("0");
        notify.success(res.data.message);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      signupLoading ||
      loginLoading ||
      sendOTPLoading ||
      verifyOtpLoading ||
      changePwdLoading
    )
      return;
    if (activeInterface === "login") await handleLogin();
    else if (activeInterface === "signup") await handleSignup();
    else if (activeInterface === "forgot") {
      if (forgotSteps === "1") {
        if (!formData.email) return;
        else await handleSendOtp();
      } else if (forgotSteps === "2") {
        if (!formData.otp) return;
        await handleVerifyOtp();
      } else if (forgotSteps === "3") {
        if (!formData.newPwd) return;
        await handleChangePassword();
      }
    }
  };

  useEffect(() => {
    setFormData({
      username: "",
      email: "",
      password: "",
      otp: "",
      newPwd: "",
    });
  }, [activeInterface]);

  return (
    <>
      <div className="min-h-screen pb-8 mt-30 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="w-full max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.35em] text-darkPrimary font-bold">
              Habit Tracker
            </p>

            <h1 className="google-sans mt-4 text-6xl font-black tracking-[-0.05em]">
              Build Habits
            </h1>

            <h1 className="google-sans text-6xl font-black tracking-[-0.05em] bg-linear-to-r from-[#5B5CF6] via-[#3B82F6] to-[#A855F7] bg-clip-text text-transparent">
              That Stick
            </h1>

            <p className="mt-5 text-gray-500 max-w-xl mx-auto">
              Track your daily habits, maintain consistency, and transform small
              actions into meaningful long-term growth.
            </p>
          </div>
          <div className="max-w-md mx-auto relative overflow-hidden rounded-4xl border border-white/10 bg-black/20 backdrop-blur-2xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
            {/* Glow */}
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-darkPrimary/10 blur-3xl" />
            {openOTP ? (
              <OTPComponent
                email={formData.email}
                setOpenOTP={setOpenOTP}
                handleSignup={handleSignup}
                setActiveInterface={setActiveInterface}
              />
            ) : (
              <div className="relative">
                {/* Header */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold google-sans">
                    Welcome Back
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Continue your habit-building journey
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  {activeInterface === "signup" && (
                    <div>
                      <label className="text-sm text-gray-400">Username</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all focus:border-darkPrimary focus:bg-white/10"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  )}

                  {(activeInterface === "login" ||
                    activeInterface === "signup" ||
                    (activeInterface === "forgot" && forgotSteps === "1")) && (
                    <div>
                      <label className="text-sm text-gray-400">
                        Email Address
                      </label>

                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all focus:border-darkPrimary focus:bg-white/10"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  {activeInterface !== "forgot" &&
                    forgotSteps !== "1" &&
                    forgotSteps !== "2" && (
                      <div>
                        <label className="text-sm text-gray-400">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all focus:border-darkPrimary focus:bg-white/10"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-5.5 cursor-pointer text-gray-500"
                          >
                            {showPassword ? (
                              <FaRegEye size={18} />
                            ) : (
                              <FaRegEyeSlash size={18} />
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                  {activeInterface === "forgot" && forgotSteps === "2" && (
                    <div>
                      <label className="text-sm text-gray-400">Enter OTP</label>
                      <input
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={formData.otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setFormData((prev) => ({
                            ...prev,
                            otp: value,
                          }));
                        }}
                        placeholder="000000"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all focus:border-darkPrimary focus:bg-white/10 tracking-[0.45em]"
                      />
                    </div>
                  )}

                  {/* New Password */}
                  {activeInterface === "forgot" && forgotSteps === "3" && (
                    <div>
                      <label className="text-sm text-gray-400">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all focus:border-darkPrimary focus:bg-white/10"
                          value={formData.newPwd}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              newPwd: e.target.value,
                            }))
                          }
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-5.5 cursor-pointer text-gray-500"
                        >
                          {showPassword ? (
                            <FaRegEye size={18} />
                          ) : (
                            <FaRegEyeSlash size={18} />
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    {activeInterface !== "forgot" ? (
                      <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                        <input type="checkbox" />
                        Remember me
                      </label>
                    ) : (
                      <div></div>
                    )}

                    {activeInterface === "forgot" ? (
                      <button
                        key="btn-cancel"
                        type="button"
                        className="text-darkPrimary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveInterface("login");
                          setForgotSteps("0");
                        }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        key="btn-forgot"
                        type="button"
                        className="text-darkPrimary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveInterface("forgot");
                          setForgotSteps("1");
                        }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  {/* signup and login button */}
                  {signupLoading ||
                  loginLoading ||
                  sendOTPLoading ||
                  verifyOtpLoading ||
                  changePwdLoading ? (
                    <div className="w-full mt-2 rounded-2xl bg-darkPrimary py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(91,92,246,0.35)]">
                      <CircleLoader />
                    </div>
                  ) : (
                    <button
                      key={`submit-${activeInterface}-${forgotSteps}`}
                      type="submit"
                      className="w-full mt-2 rounded-2xl bg-darkPrimary py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(91,92,246,0.35)] cursor-pointer"
                    >
                      {activeInterface === "login" && "Sign In"}
                      {activeInterface === "signup" && "Sign Up"}
                      {activeInterface === "forgot" &&
                        forgotSteps === "1" &&
                        "Send OTP"}
                      {activeInterface === "forgot" &&
                        forgotSteps === "2" &&
                        "Verify OTP"}
                      {activeInterface === "forgot" &&
                        forgotSteps === "3" &&
                        "Reset Password"}
                    </button>
                  )}

                  {/* Divider */}
                  {/* <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-gray-500">OR</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div> */}

                  {/* Google */}
                  {/* <button className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 transition-all hover:bg-white/10">
                  Continue with Google
                </button> */}
                </form>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                  {activeInterface === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    className="ml-1 text-darkPrimary font-medium hover:underline"
                    onClick={() => {
                      if (activeInterface === "forgot") {
                        setActiveInterface("login");
                        setForgotSteps("0");
                      } else if (activeInterface === "login") {
                        setActiveInterface("signup");
                      } else {
                        setActiveInterface("login");
                      }
                    }}
                  >
                    {activeInterface === "login" ? "Create One" : "Sign In"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const OTPComponent = ({
  email,
  setOpenOTP,
  handleSignup,
  setActiveInterface,
}: {
  email: string;
  setOpenOTP: React.Dispatch<React.SetStateAction<boolean>>;
  handleSignup: () => {};
  setActiveInterface: Dispatch<SetStateAction<string>>;
}) => {
  const [timeLeft, setTimeLeft] = useState(600);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeUp(true);
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleResend = async () => {
    await handleSignup();
    setTimeLeft(600);
    setIsTimeUp(false);
  };

  const handleCancelOTP = async () => {
    setOpenOTP(false);
    try {
      await axiosPublic.delete(`/cancel-signup-otp`, { data: { email } });
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await axiosPublic.post(`/verify-signup-otp`, {
        email,
        enteredOTP: otp,
      });
      if (res?.data?.success) {
        setOpenOTP(false);
        setActiveInterface("login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!email) setOpenOTP(false);
  }, [email]);

  return (
    <div className="mt-4 relative">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="h-18 w-18 rounded-3xl bg-darkPrimary/10 border border-darkPrimary/20 flex items-center justify-center text-3xl">
          ✉️
        </div>
      </div>

      <RxCross2
        className="cursor-pointer absolute right-0 -top-4 text-gray-500 hover:text-white light:text-black"
        onClick={handleCancelOTP}
      />

      {/* Heading */}
      <div className="text-center mt-5">
        <h2 className="text-3xl font-bold google-sans">Verify Your Email</h2>

        <p className="mt-2 text-gray-500 text-sm">
          We've sent a verification code to
        </p>

        <p className="mt-1 font-medium">{email}</p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3 mt-8">
        <input
          inputMode="numeric"
          maxLength={6}
          className=" h-14 w-full rounded-2xl tracking-widest border border-white/10 bg-white/5 text-center text-xl font-bold outline-none transition-all focus:border-darkPrimary focus:bg-white/10"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            setOtp(value);
          }}
        />
      </div>

      {/* Timer */}
      <div className="mt-6 flex justify-center">
        <div className=" rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm ">
          ⏳ Expires in{" "}
          <span className="font-semibold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Verify Button */}
      <button
        className="w-full mt-8 rounded-2xl bg-darkPrimary py-3 font-semibold text-white transition-all hover:scale-[1.02]"
        onClick={handleVerifyOTP}
      >
        Verify Account
      </button>

      {/* Resend */}
      <div className="mt-5 text-center">
        <p className="text-gray-500 text-sm">Didn't receive the code?</p>

        <button
          className={`mt-2 ${isTimeUp ? "text-darkPrimary hover:underline" : "text-darkPrimary/50"} font-medium`}
          onClick={() => {
            if (!isTimeUp) return;
            handleResend();
          }}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
