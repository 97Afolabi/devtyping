import { User } from "../data/firebase/firestore/users";
import { adminAuth, adminDb } from "./firebase-admin";

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
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch {
    throw new Error("Invalid authentication token");
  }
}

export async function requireAuthenticatedUser(
  request: Request,
): Promise<AuthenticatedUser> {
  const idToken = getBearerToken(request);
  const uid = await getUidFromIdToken(idToken);

  const userSnap = await adminDb.collection("users").doc(uid).get();
  if (!userSnap.exists) {
    throw new Error("Unable to resolve authenticated user");
  }

  const user = userSnap.data() as User;
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
