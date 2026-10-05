function convertPublicKey(value: string): ArrayBuffer {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");

  const decoded = window.atob(base64);
  const bytes = new Uint8Array(decoded.length);

  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }

  return bytes.buffer;
}

export async function subscribeToPush() {
  if (
    !window.isSecureContext ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    throw new Error(
      "Push notifications require a supported browser on HTTPS or localhost.",
    );
  }

  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error("Missing VITE_VAPID_PUBLIC_KEY");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error(
      permission === "denied"
        ? "Notifications are blocked. Allow them in your browser's site settings."
        : "Notification permission was not granted.",
    );
  }

  await navigator.serviceWorker.register("/sw.js");

  const registration = await navigator.serviceWorker.ready;

  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    return existingSubscription;
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertPublicKey(publicKey),
  });
}
