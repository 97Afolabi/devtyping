import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    return null;
  }

  try {
    return JSON.parse(serviceAccountJson);
  } catch {
    throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_JSON");
  }
}

function createFirebaseAdminApp(): App {
  const existingApp = getApps()[0];
  if (existingApp) {
    return existingApp;
  }

  const serviceAccount = getServiceAccount();
  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return initializeApp();
}

const adminApp = createFirebaseAdminApp();

export const adminDb = getFirestore(adminApp);

// firebase-admin/auth unconditionally requires jwks-rsa, which unconditionally
// requires jose — and the resolved jose build isn't require()-able as CJS in
// Vercel's serverless runtime (ERR_REQUIRE_ESM). A static top-level import of
// "firebase-admin/auth" here would pull that broken chain into every route
// that imports this module for adminDb alone (i.e. every SSR page), even
// though most of them never touch auth. Deferring to a dynamic import keeps
// that chain out of routes that only need Firestore.
let adminAuthPromise: Promise<Auth> | undefined;
export function getAdminAuth(): Promise<Auth> {
  if (!adminAuthPromise) {
    adminAuthPromise = import("firebase-admin/auth").then(({ getAuth }) =>
      getAuth(adminApp),
    );
  }
  return adminAuthPromise;
}
