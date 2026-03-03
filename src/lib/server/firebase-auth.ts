import { firestoreUser, User } from "../data/firebase/firestore/users";

interface FirebaseLookupResponse {
  users?: Array<{
    localId: string;
  }>;
}

export interface AuthenticatedUser extends User {
  uid: string;
}

function getBearerToken(request: Request): string {
  const authorizationHeader = request.headers.get("authorization");
  if (!authorizationHeader) {
    throw new Error("Missing authorization header");
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new Error("Invalid authorization header format");
  }

  return token;
}

async function getUidFromIdToken(idToken: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Firebase API key configuration");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Invalid authentication token");
  }

  const payload = (await response.json()) as FirebaseLookupResponse;
  const uid = payload.users?.[0]?.localId;
  if (!uid) {
    throw new Error("Unable to resolve authenticated user");
  }

  return uid;
}

export async function requireAuthenticatedUser(
  request: Request,
): Promise<AuthenticatedUser> {
  const idToken = getBearerToken(request);
  const uid = await getUidFromIdToken(idToken);
  const user = await firestoreUser.findById(uid);
  return {
    ...user,
    uid,
  };
}

export async function requireAdminUser(
  request: Request,
): Promise<AuthenticatedUser> {
  const user = await requireAuthenticatedUser(request);
  if (!user.isAdmin) {
    throw new Error("Forbidden");
  }

  return user;
}
