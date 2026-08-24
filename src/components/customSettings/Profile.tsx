import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { FiEdit2, FiLock, FiX } from "react-icons/fi";
import CircleLoader from "../loaders/CircleLoader";
import { axiosPrivate } from "../../api/axios";
import { notify } from "../../helper";
import { setCreds } from "../../redux/slices/authSlice";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [errMsg, setErrMsg] = useState<{
    usernameErr: string;
    oldPwdErr: string;
    newPwdErr: string;
  }>({
    usernameErr: "",
    oldPwdErr: "",
    newPwdErr: "",
  });
  const [unameLoading, setUnameLoading] = useState(false);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      setErrMsg((prev) => ({
        ...prev,
        usernameErr: "Username cannot be empty",
      }));
      return;
    }
    setUnameLoading(true);
    try {
      const res = await axiosPrivate.patch("/update-username", {
        new_username: username,
      });

      if (res?.data?.success) {
        notify.success("Username changed successfully");
        setEditing(false);
        dispatch(setCreds({ username: res?.data?.user?.username }));
      }
    } catch {
      notify.error("Please try again.");
    } finally {
      setErrMsg((prev) => ({ ...prev, usernameErr: "" }));
      setUnameLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 light:border-black/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white light:text-black">
            Profile Details
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage your basic account details here.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditing(!editing);
            if (!editing) setUsername(user.username);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition duration-300 cursor-pointer ${
            editing
              ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30"
              : "bg-white/5 hover:bg-white/10 text-white light:text-slate-700 light:bg-black/5 light:hover:bg-black/10 border-white/10 light:border-black/10"
          }`}
        >
          {editing ? (
            <>
              <FiX className="w-3.5 h-3.5" /> Cancel
            </>
          ) : (
            <>
              <FiEdit2 className="w-3.5 h-3.5" /> Edit
            </>
          )}
        </motion.button>
      </div>

      <div className="space-y-6 max-w-lg mt-4">
        {/* Username Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Username
          </label>
          {editing ? (
            <div className="flex sm:flex-row flex-col items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  className="w-full text-sm bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-xl p-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 light:placeholder:text-gray-400 text-white light:text-black transition-all duration-300"
                  placeholder={user?.username}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrMsg((prev) => ({
                      ...prev,
                      usernameErr: "",
                    }));
                  }}
                />
                <AnimatePresence>
                  {errMsg.usernameErr && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute text-[11px] text-red-500 mt-1 flex items-center gap-1"
                    >
                      <span>⚠️</span> {errMsg.usernameErr}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={unameLoading}
                className="px-6 py-3 text-sm bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/25 transition cursor-pointer flex items-center justify-center min-w-20"
                onClick={handleUpdateUsername}
              >
                {unameLoading ? <CircleLoader /> : "Save"}
              </motion.button>
            </div>
          ) : (
            <div className="p-3 bg-white/5 border border-white/5 light:bg-black/5 light:border-black/5 rounded-xl text-white light:text-black text-sm font-medium">
              {user?.username}
            </div>
          )}
        </div>

        {/* Email Field (Always Read Only) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <span className="text-[10px] bg-slate-800 light:bg-black/5 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-white/5 light:border-black/5">
              Read Only
            </span>
          </div>
          <div className="p-3 bg-white/5 border border-white/5 light:bg-black/5 light:border-black/5 rounded-xl text-white/60 light:text-black/60 text-sm font-medium flex items-center justify-between">
            <span>{user?.email}</span>
            <FiLock className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
