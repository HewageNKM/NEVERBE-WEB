import axios from "axios";

export const verifyCaptchaToken = async (token: string) => {
  try {
    console.log("Sending reCAPTCHA verification request.");
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios({
      method: "POST",
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    });
    console.log("reCAPTCHA verification response:", response.data);
    return response.data.success;
  } catch (e) {
    console.log(e);
    throw e;
  }
};