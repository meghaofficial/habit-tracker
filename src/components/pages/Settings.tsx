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
import NavigationBar from "../shared/NavigationBar";
import Subscription from "../profile/Subscription";

const sections = [
  "Profile",
  "Change Password",
  "Subscription",
  // "Notifications",
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
    old: "",
    new: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<{
    usernameErr: string;
    oldPwdErr: string;
    newPwdErr: string;
  }>({
    usernameErr: "",
    oldPwdErr: "",
    newPwdErr: "",
  });
  const [changeWOtp, setChangeWOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [changePwdAfterVerify, setChangePwdAfterVerify] = useState(false);
  const [changePwdLoading, setChangePwdLoading] = useState(false);
  const [newPwd, setNewPwd] = useState("");

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

  const handleUpdatePassword = async () => {
    if (!pwds.old.trim() || !pwds.new.trim()) {
      setErrMsg((prev) => ({
        ...prev,
        oldPwdErr: "This field is required",
        newPwdErr: "This field is required",
      }));
      return;
    }
    setPwdLoading(true);
    try {
      const res = await axiosPrivate.patch("/change-password", {
        old_password: pwds.old,
        new_password: pwds.new,
      });

      if (res?.data?.success) {
        notify.success("Passwords change successfully");
        dispatch(setCreds({ username: res?.data?.user?.username }));
        setPwds({ old: "", new: "" });
      } else {
        notify.error(res?.data?.message);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;

      notify.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setPwdLoading(false);
    }
  };

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notify.error((error as any)?.response?.data?.message || "An unexpected error occurred");
    } finally {
      setSendOTPLoading(false);
    }
  };

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notify.error((error as any)?.response?.data?.message || "An unexpected error occurred");
    } finally {
      setVerifyOtpLoading(false);
    }
  };

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notify.error((error as any)?.response?.data?.message || "An unexpected error occurred");
    } finally {
      setChangePwdLoading(false);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center py-5 sm:pt-5 mt-4 w-full px-5">
        <NavigationBar />
      </nav>
      <div className="min-h-screen flex google-sans p-2 px-5 pb-4 gap-4">
        {/* Sidebar */}
        <div className="w-64 border rounded-3xl bg-black/20 light:bg-lightCard light:border-black/10  border-white/10 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <IoIosArrowBack
              className="cursor-pointer light:text-black"
              onClick={() => navigate("/")}
            />
            <h2 className="text-xl font-semibold light:text-black">Settings</h2>
          </div>

          {sections.map((item) => (
            <div
              key={item}
              onClick={() => setActive(item)}
              className={`cursor-pointer px-4 py-2 rounded-lg text-[14px] transition ${
                active === item
                  ? "bg-white/10 light:bg-black/10 text-[#a955f7] font-bold"
                  : "hover:bg-white/5 text-gray-400"
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex-col w-full">
          {active !== "Profile" && (
            <div className="w-full flex items-center border rounded-2xl mb-4 bg-black/20 light:bg-lightCard light:border-black/10 h-20 border-white/10 p-6 gap-4">
              <div className="rounded-full bg-white/10 light:bg-black/10 h-10 w-10 flex items-center justify-center">
                {user.username.slice(0, 1)}
              </div>
              <div>
                <p>{user.username}</p>
                <p className="text-[12px] text-gray-500">{user.email}</p>
              </div>
            </div>
          )}

          <div className="flex-1 p-6 w-full border rounded-3xl bg-black/20 light:bg-lightCard light:border-black/10 border-white/10">
            {/* PROFILE */}
            {active === "Profile" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-semibold light:text-black">
                    Profile
                  </h1>

                  <button
                    onClick={() => setEditing(!editing)}
                    className="px-4 py-1.5 text-[12px] rounded-lg bg-white/10 light:bg-black/10 light:text-black hover:bg-white/20"
                  >
                    {editing ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-gray-400 text-[13px]">Username</p>
                    {editing ? (
                      <div className="flex items-center gap-3 w-full">
                        <div className="relative w-full">
                          <input
                            className="mt-1 w-full text-[13px] bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-lg p-2 light:placeholder:text-gray-400 light:text-black"
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
                          {errMsg.usernameErr && (
                            <p className="absolute text-[10px] pt-0.5 text-red-500">
                              {errMsg.usernameErr}
                            </p>
                          )}
                        </div>
                        <button
                          className={`px-4 py-2 text-[13px] bg-darkSuccess text-black border border-yellow-500/30 rounded-lg ${!unameLoading && "hover:bg-darkSuccess/90 hover:text-white cursor-pointer"}`}
                          onClick={() =>
                            !unameLoading && handleUpdateUsername()
                          }
                        >
                          {unameLoading ? <CircleLoader /> : "Save"}
                        </button>
                      </div>
                    ) : (
                      <p className="text-lg light:text-black text-[14px]">
                        {user?.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-400 text-[13px]">Email</p>
                    <p className="text-lg opacity-70 light:text-black text-[14px]">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {active === "Change Password" && (
              <div>
                {/* <div className="w-20 rounded-lg h-5 animate-pulse bg-white/10 light:bg-black/10"></div> */}
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-semibold">Change Password</h1>
                  {changeWOtp ? (
                    <p
                      className="text-[12px] hover:underline text-blue-600 cursor-pointer"
                      onClick={() => setChangeWOtp(false)}
                    >
                      Change with old password
                    </p>
                  ) : (
                    <p
                      className="text-[12px] hover:underline text-blue-600 cursor-pointer"
                      onClick={() => {
                        if (sendOTPLoading) return;
                        setChangeWOtp(true);
                        handleSendOtp();
                      }}
                    >
                      {sendOTPLoading ? (
                        <div className="w-20 rounded-lg h-5 animate-pulse bg-white/10 light:bg-black/10"></div>
                      ) : (
                        <p>Change with Otp</p>
                      )}
                    </p>
                  )}
                </div>

                {!changeWOtp ? (
                  <>
                    <div className="relative w-full">
                      <input
                        className="mt-1 w-full bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-lg p-2 text-[13px]"
                        placeholder="Old Password"
                        value={pwds.old}
                        onChange={(e) => {
                          setPwds((prev) => ({
                            ...prev,
                            old: e.target.value,
                          }));
                          setErrMsg((prev) => ({ ...prev, oldPwdErr: "" }));
                        }}
                      />
                      {errMsg.oldPwdErr && (
                        <p className="text-[10px] pt-0.5 text-red-500">
                          {errMsg.oldPwdErr}
                        </p>
                      )}
                    </div>

                    <div className="relative w-full my-3 mb-5">
                      <input
                        className="w-full text-[13px] bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-lg p-2"
                        placeholder="New Password"
                        value={pwds.new}
                        onChange={(e) => {
                          setPwds((prev) => ({
                            ...prev,
                            new: e.target.value,
                          }));
                          setErrMsg((prev) => ({ ...prev, newPwdErr: "" }));
                        }}
                      />
                      {errMsg.newPwdErr && (
                        <p className="text-[10px] pt-0.5 text-red-500">
                          {errMsg.newPwdErr}
                        </p>
                      )}
                    </div>

                    <button
                      className={`px-3 py-1.5 text-[13px] bg-yellow-500/20 border border-yellow-500/30 rounded-lg ${!pwdLoading && "hover:bg-yellow-500/30 cursor-pointer"}`}
                      onClick={() => !pwdLoading && handleUpdatePassword()}
                    >
                      {pwdLoading ? <CircleLoader /> : "Change Password"}
                    </button>
                  </>
                ) : sendOTPLoading ? (
                  <div className="w-full rounded-lg h-20 animate-pulse bg-white/10 light:bg-black/10"></div>
                ) : changePwdAfterVerify ? (
                  <>
                    <p className="text-[12px] text-gray-500 mb-4">
                      Account has been verified. Do not refresh or close this
                      tab for successful password change.
                    </p>
                    <div className="flex items-start gap-3">
                      <div className="relative w-1/2">
                        <input
                          type="text"
                          className="w-full bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-lg p-2 text-[13px]"
                          placeholder="Enter new password"
                          value={newPwd}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewPwd(value);
                          }}
                        />
                      </div>
                      <button
                        className={`px-5 py-2 text-[13px] bg-green-500/20 text-nowrap border border-green-500/30 rounded-lg ${!changePwdLoading && "hover:bg-green-500/30 cursor-pointer"}`}
                        onClick={() =>
                          !changePwdLoading && newPwd && handleChangePassword()
                        }
                      >
                        {changePwdLoading ? <CircleLoader /> : "Submit"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[12px] text-gray-500 mb-4">
                      OTP has been sent to {user.email} & will be valid till 10
                      min
                    </p>
                    <div className="flex items-start gap-3">
                      <div className="relative w-1/2">
                        <input
                          className="w-full bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 rounded-lg p-2 text-[13px]"
                          placeholder="Enter OTP"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setOtp(value);
                          }}
                        />
                      </div>
                      <button
                        className={`px-5 py-2 text-[13px] bg-yellow-500/20 text-nowrap border border-yellow-500/30 rounded-lg ${!pwdLoading && "hover:bg-yellow-500/30 cursor-pointer"}`}
                        onClick={() =>
                          !verifyOtpLoading && otp && handleVerifyOtp()
                        }
                      >
                        {verifyOtpLoading ? <CircleLoader /> : "Verify"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* SUBSCRIPTION */}
            {active === "Subscription" && (
              <Subscription />
            )}

            {/* NOTIFICATIONS */}
            {active === "Notifications" && (
              <div>
                <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

                <div className="flex flex-col gap-8">
                  {[
                    { label: "Daily Reminders", checked: true },
                    { label: "Weekly Summary", checked: true },
                    { label: "Monthly Summary", checked: true },
                    { label: "Daily Reminders", checked: true },
                    { label: "Daily Reminders", checked: true },
                    { label: "Daily Reminders", checked: true },
                  ].map((data, index) => (
                    <div
                      className="flex justify-between items-center"
                      key={index}
                    >
                      <span>{data.label}</span>
                      <input
                        type="checkbox"
                        className="accent-purple-500"
                        // defaultChecked
                        checked={data.checked}
                      />
                    </div>
                  ))}
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
      </div>
    </>
  );
};

export default Settings;
