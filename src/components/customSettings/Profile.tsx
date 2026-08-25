import { motion, AnimatePresence } from "framer-motion";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import CircleLoader from "../loaders/CircleLoader";
import { axiosPrivate } from "../../api/axios";
import { notify } from "../../helper";
import { setCreds } from "../../redux/slices/authSlice";
import {
  FiUser,
  FiAtSign,
  FiEdit2,
  FiX,
  FiCheck,
  FiLock,
  FiMail,
  FiInfo,
} from "react-icons/fi";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const [unameLoading, setUnameLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      setErrMsg("Username cannot be empty");
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
      setErrMsg("");
      setUnameLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <Header
        editing={editing}
        setEditing={setEditing}
        setUsername={setUsername}
      />
      <div className="max-w-2xl space-y-5">
        {/* Username */}
        <div className="rounded-2xl border border-white/6 bg-white/1.5 p-5 light:border-black/6 light:bg-black/1.5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Username
              </label>

              <p className="mt-1 text-[11px] text-zinc-600">
                This is how you'll be identified on your account.
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/[0.07] text-indigo-400">
              <FiAtSign className="h-3.5 w-3.5" />
            </div>
          </div>

          {editing ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="relative flex-1">
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />

                  <input
                    className="w-full rounded-xl border border-white/8 bg-zinc-950/50 py-3 pl-10 pr-4 text-sm font-medium text-white outline-none transition-all duration-300 placeholder:text-zinc-700 focus:border-indigo-400/30 focus:bg-indigo-500/3 focus:ring-2 focus:ring-indigo-500/10 light:border-black/10 light:bg-black/3 light:text-black"
                    placeholder={user?.username}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrMsg("");
                    }}
                  />
                </div>

                <AnimatePresence>
                  {errMsg && (
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -5,
                      }}
                      className="mt-2 flex items-center gap-1.5 text-[11px] text-red-400"
                    >
                      <span>⚠️</span>
                      {errMsg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Save button */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(99,102,241,0.18)",
                }}
                whileTap={{
                  scale: 0.97,
                }}
                disabled={unameLoading}
                onClick={handleUpdateUsername}
                className="flex min-w-22.5 items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/15 px-5 py-3 text-sm font-semibold text-indigo-300 transition-all duration-300 hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {unameLoading ? (
                  <CircleLoader />
                ) : (
                  <>
                    <FiCheck className="h-3.5 w-3.5" />
                    Save
                  </>
                )}
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-white/6 bg-zinc-950/40 px-4 py-3.5 light:border-black/6 light:bg-black/3">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />

                <span className="text-sm font-medium text-zinc-200 light:text-black">
                  {user?.username}
                </span>
              </div>

              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                Username
              </span>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="rounded-2xl border border-white/6 bg-white/1.5 p-5 light:border-black/6 light:bg-black/1.5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  Email Address
                </label>

                <span className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600 light:border-black/10 light:bg-black/5">
                  <FiLock className="h-2.5 w-2.5" />
                  Read Only
                </span>
              </div>

              <p className="mt-1 text-[11px] text-zinc-600">
                Your email address cannot be changed from here.
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-600 light:bg-black/5">
              <FiMail className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-950/30 px-4 py-3.5 light:border-black/6 light:bg-black/3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 light:bg-black/5">
                <FiMail className="h-3 w-3 text-zinc-600" />
              </div>

              <span className="truncate text-sm font-medium text-zinc-400 light:text-black/60">
                {user?.email}
              </span>
            </div>

            <FiLock className="ml-3 h-3.5 w-3.5 shrink-0 text-zinc-700" />
          </div>
        </div>
      </div>

      {/* Editing info */}
      <Info editing={editing} />
    </div>
  );
};

const Header = ({
  editing,
  setEditing,
  setUsername,
}: {
  editing: boolean;
  setEditing: Dispatch<SetStateAction<boolean>>;
  setUsername: Dispatch<SetStateAction<string>>;
}) => {
  const user = useSelector((state: RootState) => state.auth);
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10">
          <FiUser className="h-4 w-4 text-indigo-400" />
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white light:text-black">
            Profile Details
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Manage your basic account details here.
          </p>
        </div>
      </div>

      {/* Edit / Cancel */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          setEditing(!editing);

          if (!editing) {
            setUsername(user.username);
          }
        }}
        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-300 ${
          editing
            ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/15"
            : "border-white/8 bg-white/4 text-zinc-300 hover:border-indigo-400/20 hover:bg-indigo-500/6 hover:text-indigo-300 light:border-black/10 light:bg-black/3 light:text-slate-700"
        }`}
      >
        {editing ? (
          <>
            <FiX className="h-3.5 w-3.5" />
            Cancel
          </>
        ) : (
          <>
            <FiEdit2 className="h-3.5 w-3.5" />
            Edit Profile
          </>
        )}
      </motion.button>
    </div>
  );
};

const Info = ({ editing }: { editing: boolean }) => {
  return (
    <AnimatePresence>
      {editing && (
        <motion.div
          initial={{
            opacity: 0,
            height: 0,
            y: -5,
          }}
          animate={{
            opacity: 1,
            height: "auto",
            y: 0,
          }}
          exit={{
            opacity: 0,
            height: 0,
            y: -5,
          }}
          className="flex items-start gap-3 overflow-hidden rounded-xl border border-indigo-400/10 bg-indigo-500/4 px-4 py-3"
        >
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
            <FiInfo className="h-3.5 w-3.5 text-indigo-400" />
          </div>

          <div>
            <p className="text-xs font-medium text-indigo-300">
              Editing profile
            </p>

            <p className="mt-1 text-[11px] leading-5 text-zinc-600">
              Update your username and save the changes when you're ready.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Profile;
