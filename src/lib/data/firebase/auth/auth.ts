import {
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User,
  getAuth,
  getAdditionalUserInfo,
} from "firebase/auth";
import { firebaseApp } from "../firebase";
import { firestoreUser } from "../firestore/users";

export const auth = getAuth(firebaseApp);

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGithub() {
  if (typeof window !== "undefined") {
    const provider = new GithubAuthProvider();
    provider.addScope("read:user");

    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      //   const credential = GithubAuthProvider.credentialFromResult(result);
      //   if (!credential) {
      //     throw new Error("Unable to get Access token");
      //   }

      // The signed-in user info.
      const user = result.user;
      if (!user) {
        throw new Error("Failed to get user info");
      }

      const data = {
        slug: user.uid,
        username: getAdditionalUserInfo(result)!.username!,
      };

      if (user.metadata.creationTime === user.metadata.lastSignInTime) {
        // create new user
        await firestoreUser.save(data);
      }

      return data;
    } catch (error) {
      console.error("Error signing in with Github", error);
      throw new Error("Error signing in with Github");
    }
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Github", error);
  }
}
