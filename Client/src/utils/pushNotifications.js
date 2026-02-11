import { BASE_URL } from "./constant";

const VAPID_PUBLIC_KEY =
  "BKA33fuYXnBbsAOxIsy1jqOYErfSC8f6-5J1xR3pAiWrgAcc17_ojHjcBYdqUwX40u-XdjuVe6-GuFNprGF741E";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const registerPushNotifications = async (userId) => {
  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    // Always update the server with the latest subscription for this user
    await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription,
        userId: userId || localStorage.getItem("userId"), // Fallback to localStorage
      }),
    });

    console.log("Push notifications registered successfully");
  } catch (error) {
    console.error("Push registration failed:", error);
  }
};
