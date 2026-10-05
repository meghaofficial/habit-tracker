import { useState } from "react";
import { subscribeToPush } from "../utils/subscribeToPush";
import { axiosPrivate } from "../api/axios";

const EnableNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const savePushSubscription = async (subscription: PushSubscription) => {
    const { data } = await axiosPrivate.post(
      "/api/notifications/subscribe",
      subscription.toJSON(),
    );

    return data;
  };

  const sendTestPush = async () => {
    const { data } = await axiosPrivate.post("/api/notifications/test");
    return data;
  };

  const handleEnable = async () => {
    setLoading(true);
    setMessage("");

    try {
      const subscription = await subscribeToPush();

      await savePushSubscription(subscription);

      setMessage("Browser subscription created successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not enable notifications.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Ask your backend to send a test notification.
      const data = await sendTestPush();
      setMessage(data.message);
    } catch {
      setMessage("Could not send the test notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleEnable}
          disabled={loading}
          className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-medium text-indigo-400 transition hover:bg-indigo-500/20 disabled:opacity-50"
        >
          Enable notifications
        </button>

        <button
          type="button"
          onClick={handleTest}
          disabled={loading}
          className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-medium text-indigo-400 transition hover:bg-indigo-500/20 disabled:opacity-50"
        >
          Send test notification
        </button>
      </div>

      {message && (
        <p role="status" className="text-xs text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
};

export default EnableNotifications;
