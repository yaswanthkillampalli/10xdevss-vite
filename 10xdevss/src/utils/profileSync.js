const PROFILE_SNAPSHOT_KEY = "10xdevss_profile_snapshot";
const PROFILE_UPDATED_EVENT = "profile:updated";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getStoredProfileSnapshot = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PROFILE_SNAPSHOT_KEY);
  return raw ? safeParse(raw) : null;
};

const writeProfileSnapshot = (profile) => {
  if (typeof window === "undefined" || !profile) return;

  window.localStorage.setItem(PROFILE_SNAPSHOT_KEY, JSON.stringify(profile));
  window.dispatchEvent(
    new CustomEvent(PROFILE_UPDATED_EVENT, {
      detail: profile,
    })
  );
};

const subscribeToProfileSnapshot = (onUpdate) => {
  if (typeof window === "undefined") return () => {};

  const handleProfileUpdate = (event) => {
    onUpdate(event?.detail || null);
  };

  const handleStorage = (event) => {
    if (event.key !== PROFILE_SNAPSHOT_KEY) return;
    onUpdate(event.newValue ? safeParse(event.newValue) : null);
  };

  window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
    window.removeEventListener("storage", handleStorage);
  };
};

export {
  PROFILE_SNAPSHOT_KEY,
  getStoredProfileSnapshot,
  writeProfileSnapshot,
  subscribeToProfileSnapshot,
};
