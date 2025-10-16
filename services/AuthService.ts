import { adminAuth } from "@/firebase/firebaseAdmin";

// Function to verify Firebase ID token from request headers
export const verifyToken = async (req: any) => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authorization header is missing or invalid");
    }

    const idToken = authHeader.split(" ")[1];
    console.log("Verifying ID token.");
    return await adminAuth.verifyIdToken(idToken);
  } catch (e) {
    console.log(e);
    throw e;
  }
};