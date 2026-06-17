import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setCreds } from "../../redux/slices/authSlice";
import { axiosPublic } from "../../api/axios";
import CircleLoader from "../loaders/CircleLoader";
import { notify } from "../../helper";
import axios from "axios";

// const AuthForm = () => {

//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: ""
//   });
//   const dispatch = useDispatch();
//   const [loginActive, setLoginActive] = useState(true);
//   const [signupLoading, setSignupLoading] = useState(false);
//   const [loginLoading, setLoginLoading] = useState(false);
//     const [open, setOpen] = useState(false);

//   const handleSignup = async () => {
//     setSignupLoading(true);
//     try {

//       const { username, email, password } = formData;
//       if (!username || !email || !password) return;

//       const res = await axiosPublic.post("/signup", { username, email, password });

//       if (res?.data?.success) {
//         notify.success(res?.data?.message || "Account created successfully");
//         setLoginActive(true);
//       }

//     } catch (error) {
//       console.error(error);
//       notify.error("Registration failed. Please try again.");
//     } finally {
//       setSignupLoading(false);
//     }
//   }
//   const handleLogin = async () => {
//     setLoginLoading(true);
//     try {

//       const { email, password } = formData;
//       if (!email || !password) return;

//       const res = await axiosPublic.post("/login", { email, password });

//       if (res?.data?.success) {
//         const accessToken = res?.data?.accessToken;
//         const { username, email, id } = res?.data?.user;
//         dispatch(setCreds({ username, email, id, accessToken }));
//         setFormData({
//           username: "",
//           email: "",
//           password: ""
//         });
//         setOpen(false);
//       }
//       else {
//         notify.error(res.data.message);
//       }

//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         notify.error(error.response?.data.message);
//         // console.error("Error Data:", error.response?.data);
//       } else {
//         // console.error("Unexpected Error:", error);
//         notify.error("Login failed. Please try again.");
//       }
//     } finally {
//       setLoginLoading(false);
//     }
//   }

//   const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (signupLoading || loginLoading) return;
//     if (loginActive) await handleLogin();
//     else await handleSignup();
//   }

//   useEffect(() => {
//     setFormData({
//       username: "",
//       email: "",
//       password: ""
//     });
//   }, [loginActive]);

//   return (
//     <>
//       <AnimatePresence>
//         {open && (
//           <>
//             {/* Overlay */}
//             <motion.div
//               className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setOpen(false)} // click outside to close
//             />

//             {/* Modal */}
//             <motion.div
//               className="fixed inset-0 flex justify-center z-50"
//               initial={{ opacity: 0, scale: 0.9, y: 40 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 40 }}
//               transition={{ duration: 0.25 }}
//             >
//               <div className="hide-scrollbar h-full py-6">
//                 <div
//                   onClick={(e) => e.stopPropagation()}
//                   className="bg-darkBg light:bg-lightBg w-100 overflow-y-auto hide-scrollbar rounded-xl h-full p-6 px-8 shadow-xl relative"
//                 >
//                   <RxCross2 className="cursor-pointer absolute right-7 top-7.5" onClick={() => setOpen(false)} />
//                   {/* Header */}
//                   <h2 className="text-2xl font-semibold mb-4">{loginActive ? 'Log in' : 'Sign up'}</h2>
//                   <p className="text-sm text-gray-500 mb-4 select-none">
//                     New user?{" "}
//                     <span className="text-blue-600 focus:underline cursor-pointer" onClick={() => setLoginActive(prev => !prev)}>
//                       {loginActive ? 'Register Now' : 'Login Now'}
//                     </span>
//                   </p>

//                   {/* Google Button */}
//                   {/* <button className="w-full flex items-center cursor-pointer justify-center gap-3 border rounded-lg py-2 mb-4">
//                     <img
//                       src="https://www.svgrepo.com/show/475656/google-color.svg"
//                       className="w-5 h-5"
//                     />
//                     Continue with Google
//                   </button> */}

//                   {/* Divider */}
//                   {/* <div className="flex items-center gap-3 my-4">
//                     <div className="flex-1 h-px bg-gray-200" />
//                     <span className="text-sm text-gray-400">or</span>
//                     <div className="flex-1 h-px bg-gray-200" />
//                   </div> */}

//                   {/* Form */}
//                   <form className="space-y-4" onSubmit={handleSubmit}>
//                     {!loginActive && (
//                       <div>
//                         <label className="text-sm font-medium">
//                           Username
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="Username"
//                           className="w-full mt-1 px-3 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkPrimary light:focus:ring-lightPrimary text-sm"
//                           required
//                           value={formData.username}
//                           onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
//                         />
//                       </div>
//                     )}

//                     <div>
//                       <label className="text-sm font-medium">
//                         Email
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="Email"
//                         className="w-full mt-1 px-3 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkPrimary light:focus:ring-lightPrimary text-sm"
//                         required
//                         value={formData.email}
//                         onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium">Password</label>
//                       <div className="relative mt-1">
//                         <input
//                           value={formData.password}
//                           onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Enter password"
//                           className="w-full px-3 py-2 border border-gray-500 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-darkPrimary light:focus:ring-lightPrimary text-sm"
//                         />
//                         <span
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
//                         >
//                           {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Remember + Forgot */}
//                     <div className="flex justify-between items-center text-sm mt-10">
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" className="accent-green-700" />
//                         <span className="-mt-1">Remember Me</span>
//                       </label>
//                       <span className="text-blue-600 cursor-pointer hover:underline">
//                         Forgot password
//                       </span>
//                     </div>

//                     {/* Submit */}
//                     <button type="submit" className="w-full bg-darkSuccess light:bg-lightSuccess cursor-pointer text-white py-2 rounded-lg mt-2 transition">
//                       {(!signupLoading && !loginLoading) ? loginActive ? 'Log In' : 'Sign Up' : <CircleLoader />}
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//     </>
//   )
// }

// export default AuthForm

import { RxCross2 } from "react-icons/rx";

const AuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [loginActive, setLoginActive] = useState(true);
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [openOTP, setOpenOTP] = useState(false);

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
        // setLoginActive(true);
      }
    } catch (error) {
      console.error(error);
      notify.error((error as any)?.response?.error);
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
        });
        // setOpen(false);
      } else {
        notify.error(res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        notify.error(error.response?.data.message);
      }
      // else {
      //   notify.error("Login failed. Please try again.");
      // }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (signupLoading || loginLoading) return;
    if (loginActive) await handleLogin();
    else await handleSignup();
  };

  useEffect(() => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  }, [loginActive]);

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
                setLoginActive={setLoginActive}
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
                <div className="mt-8 space-y-4">
                  {!loginActive && (
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

                  <div>
                    <label className="text-sm text-gray-400">Password</label>

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

                  <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                      <input type="checkbox" />
                      Remember me
                    </label>

                    <button className="text-darkPrimary hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    className="w-full mt-2 rounded-2xl bg-darkPrimary py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(91,92,246,0.35)]"
                    onClick={handleSubmit}
                  >
                    {!signupLoading && !loginLoading ? (
                      loginActive ? (
                        "Sign In"
                      ) : (
                        "Sign Up"
                      )
                    ) : (
                      <CircleLoader />
                    )}
                  </button>

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
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                  {loginActive
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    className="ml-1 text-darkPrimary font-medium hover:underline"
                    onClick={() => setLoginActive((prev) => !prev)}
                  >
                    {loginActive ? "Create One" : "Sign In"}
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
  setLoginActive
}: {
  email: string;
  setOpenOTP: React.Dispatch<React.SetStateAction<boolean>>;
  handleSignup: () => {};
  setLoginActive: React.Dispatch<React.SetStateAction<boolean>>;
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
        setLoginActive(true);
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
