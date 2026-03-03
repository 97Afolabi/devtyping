import { auth } from "./auth";

async function getIdToken(): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Please log in");
  }

  return currentUser.getIdToken();
}

export async function postWithAuth<TBody extends object>(
  endpoint: string,
  body: TBody,
): Promise<Response> {
  const token = await getIdToken();

  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}
