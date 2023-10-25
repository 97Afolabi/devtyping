export function getAuthUser(): { username: string; isAdmin: boolean } | null {
  const localStorageSupported =
    typeof window !== "undefined" && "localStorage" in window;

  if (!localStorageSupported) {
    return null;
  }
  const dtUser = localStorage.getItem("dtUser");
  if (!dtUser) {
    return null;
  }
  return JSON.parse(dtUser);
}
