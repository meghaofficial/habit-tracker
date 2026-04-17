import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store/store";
import { axiosPrivate } from "../../api/axios";
import { notify } from "../../helper";
import { setCreds } from "../../redux/slices/authSlice";
import type { AxiosError } from "axios";
import CircleLoader from "../loaders/CircleLoader";

const sections = [
  "Profile",
  "Security",
  "Subscription",
  "Billing",
  "Notifications",
  "Support",
];

const Settings = () => {
  const [active, setActive] = useState("Profile");
  const [editing, setEditing] = useState(false);
  const user = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [unameLoading, setUnameLoading] = useState(false);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const [pwds, setPwds] = useState({
    old: "", new: ""
  });
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      notify.error("Username cannot be empty");
      return;
    }
    setUnameLoading(true);
    try {

      const res = await axiosPrivate.patch("/update-username", { new_username: username });

      if (res?.data?.success) {
        notify.success("Username changed successfully");
        setEditing(false);
        dispatch(setCreds({ username: res?.data?.user?.username }));
      }

    } catch {
      notify.error("Please try again.");
    } finally {
      setUnameLoading(false);
    }
  }

  const handleUpdatePassword = async () => {
    if (!pwds.old.trim() || !pwds.new.trim()) {
      notify.error("Passwords cannot be empty");
      return;
    }
    setPwdLoading(true);
    try {

      const res = await axiosPrivate.patch("/change-password", { old_password: pwds.old, new_password: pwds.new });

      if (res?.data?.success) {
        notify.success("Passwords change successfully");
        dispatch(setCreds({ username: res?.data?.user?.username }));
        setPwds({ old: "", new: "" });
      }
      else {
        notify.error(res?.data?.message);
      }

    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;

      notify.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setPwdLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0b132b] via-[#0f1c3f] to-[#0a0f1f] text-white flex google-sans">

      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <IoIosArrowBack className="cursor-pointer" onClick={() => navigate("/")} />
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>

        {sections.map((item) => (
          <div
            key={item}
            onClick={() => setActive(item)}
            className={`cursor-pointer px-4 py-2 rounded-lg transition ${active === item
              ? "bg-white/10 text-purple-300"
              : "hover:bg-white/5 text-gray-400"
              }`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-10 max-w-3xl">

        {/* PROFILE */}
        {active === "Profile" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Profile</h1>

              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-6">

              <div>
                <p className="text-gray-400 text-sm">Username</p>
                {editing ? (
                  <div className="flex items-center gap-3">
                    <input className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-2" placeholder={user?.username} value={username} onChange={(e) => setUsername(e.target.value)} />
                    <button className={`px-4 py-2 bg-green-500/20 border border-yellow-500/30 rounded-lg ${!unameLoading && 'hover:bg-green-500/30 cursor-pointer'}`} onClick={() => !unameLoading && handleUpdateUsername()}>
                      {unameLoading ? <CircleLoader /> : "Save"}
                    </button>
                  </div>
                ) : (
                  <p className="text-lg">{user?.username}</p>
                )}
              </div>

              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-lg opacity-70">{user?.email}</p>
              </div>

            </div>
          </div>
        )}

        {/* SECURITY */}
        {active === "Security" && (
          <div>
            <h1 className="text-2xl font-semibold mb-6">Security</h1>

            <input className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-2" placeholder="Old Password" value={pwds.old} onChange={(e) => setPwds(prev => ({ ...prev, old: e.target.value }))} />

            <input className="my-3 mb-5 w-full bg-white/5 border border-white/10 rounded-lg p-2" placeholder="New Password" value={pwds.new} onChange={(e) => setPwds(prev => ({ ...prev, new: e.target.value }))} />

            <button className={`px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg ${!pwdLoading && 'hover:bg-yellow-500/30 cursor-pointer'}`} onClick={() => !pwdLoading && handleUpdatePassword()}>
              {pwdLoading ? <CircleLoader /> : 'Change Password'}
            </button>
          </div>
        )}

        {/* SUBSCRIPTION */}
        {active === "Subscription" && (
          <div>
            <h1 className="text-2xl font-semibold mb-6">Subscription</h1>

            <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-4">
              <div>
                <p className="text-lg">Pro Plan</p>
                <p className="text-sm text-gray-400">Renews May 2026</p>
              </div>

              <button className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600">
                Extend Plan
              </button>
            </div>
          </div>
        )}

        {/* BILLING */}
        {active === "Billing" && (
          <div>
            <h1 className="text-2xl font-semibold mb-6">Billing</h1>

            <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
              View Invoices
            </button>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {active === "Notifications" && (
          <div>
            <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

            <div className="flex justify-between items-center">
              <span>Email Notifications</span>
              <input type="checkbox" className="accent-purple-500" defaultChecked />
            </div>
          </div>
        )}

        {/* SUPPORT */}
        {active === "Support" && (
          <div>
            <h1 className="text-2xl font-semibold mb-6">Support</h1>

            <p className="text-gray-400">Contact</p>
            <p className="text-blue-400">support@habitflow.ai</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;