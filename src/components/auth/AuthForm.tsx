import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { setCreds } from "../../redux/slices/authSlice";
import { axiosPublic } from "../../api/axios";
import CircleLoader from "../loaders/CircleLoader";
import { notify } from "../../helper";

const AuthForm = ({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const dispatch = useDispatch();
  const [loginActive, setLoginActive] = useState(true);
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);


  const handleSignup = async () => {
    setSignupLoading(true);
    try {

      const { username, email, password } = formData;
      if (!username || !email || !password) return;

      const res = await axiosPublic.post("/signup", { username, email, password });

      if (res?.data?.success) {
        notify.success(res?.data?.message || "Account created successfully");
        setLoginActive(true);
      }

    } catch (error) {
      console.error(error);
      notify.error("Registration failed. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  }
  const handleLogin = async () => {
    setLoginLoading(true);
    try {

      const { email, password } = formData;
      if (!email || !password) return;

      const res = await axiosPublic.post("/login", { email, password });

      if (res?.data?.success) {
        const { username, email, id } = res?.data?.user;
        dispatch(setCreds({ username, email, id }));
        setFormData({
          username: "",
          email: "",
          password: ""
        });
        setOpen(false);
      }

    } catch (error) {
      console.error(error);
      notify.error("Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signupLoading || loginLoading) return;
    if (loginActive) await handleLogin();
    else await handleSignup();
  }

  useEffect(() => {
    setFormData({
      username: "",
      email: "",
      password: ""
    });
  }, [loginActive]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)} // click outside to close
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex justify-center z-50 overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.25 }}
            >
              <div className="overflow-y-auto hide-scrollbar h-full py-6">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-darkBg light:bg-lightBg w-100 overflow-y-auto hide-scrollbar rounded-xl h-full p-6 px-8 shadow-xl relative"
                >
                  <RxCross2 className="cursor-pointer absolute right-7 top-7.5" onClick={() => setOpen(false)} />
                  {/* Header */}
                  <h2 className="text-2xl font-semibold mb-4">{loginActive ? 'Log in' : 'Sign up'}</h2>
                  <p className="text-sm text-gray-500 mb-4 select-none">
                    New user?{" "}
                    <span className="text-blue-600 focus:underline cursor-pointer" onClick={() => setLoginActive(prev => !prev)}>
                      {loginActive ? 'Register Now' : 'Login Now'}
                    </span>
                  </p>

                  {/* Google Button */}
                  <button className="w-full flex items-center cursor-pointer justify-center gap-3 border rounded-lg py-2 mb-4">
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      className="w-5 h-5"
                    />
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Form */}
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {!loginActive && (
                      <div>
                        <label className="text-sm font-medium">
                          Username
                        </label>
                        <input
                          type="text"
                          placeholder="Username"
                          className="w-full mt-1 px-3 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkPrimary light:focus:ring-lightPrimary text-sm"
                          required
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        type="text"
                        placeholder="Email"
                        className="w-full mt-1 px-3 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkPrimary light:focus:ring-lightPrimary text-sm"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Password</label>
                      <div className="relative mt-1">
                        <input
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="w-full px-3 py-2 border border-gray-500 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-darkPrimary light:focus:ring-lightPrimary text-sm"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                        >
                          {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                        </span>
                      </div>
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex justify-between items-center text-sm mt-10">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="accent-green-700" />
                        <span className="-mt-1">Remember Me</span>
                      </label>
                      <span className="text-blue-600 cursor-pointer hover:underline">
                        Forgot password
                      </span>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="w-full bg-darkSuccess light:bg-lightSuccess cursor-pointer text-white py-2 rounded-lg mt-2 transition">
                      {(!signupLoading && !loginLoading) ? loginActive ? 'Log In' : 'Sign Up' : <CircleLoader />}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  )
}

export default AuthForm
