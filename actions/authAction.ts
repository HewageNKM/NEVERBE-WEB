import { auth } from "@/firebase/firebaseClient";
import { sendPasswordResetEmail } from "firebase/auth";

export const sendPasswordResetLinkAction = async (email: string) => {
  try {
    const actionCodeSettings = {
      // Directs the user back to the Web login after they complete the reset
      url: `${window.location.origin}/account/login`,
      handleCodeInApp: false,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  } catch (e: any) {
    throw new Error(e.message);
  }
};
