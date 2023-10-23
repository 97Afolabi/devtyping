export function getAuthUser(): { id: string; username: string } | null {
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
