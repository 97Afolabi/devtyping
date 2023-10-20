import { initializeApp } from "firebase/app";
import { envVars } from "../../constants/utils";

// Initialize Firebase
export const firebaseApp = initializeApp(envVars.firebase);
