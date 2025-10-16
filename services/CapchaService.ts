import axios from "axios";

/**
 * Verifies Google reCAPTCHA v3 token.
 * @param token - The token received from the frontend.
 * @returns boolean - true if verification succeeds, false otherwise.
 */
export const verifyCaptchaToken = async (token: string): Promise<boolean> => {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    throw new Error("RECAPTCHA_SECRET_KEY is not set in environment variables.");
  }

  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);

    const { data } = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params
    );

    console.log("reCAPTCHA verification response:", data);

    // For reCAPTCHA v3, you can also check score if needed
    // Example: data.score > 0.5 is considered human
    if (data.success && data.score && data.score >= 0.5) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
};
