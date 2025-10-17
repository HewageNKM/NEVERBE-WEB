import { verifyToken } from "@/services/AuthService";
import { verifyCaptchaToken } from "@/services/CapchaService";
import {
  sendOrderConfirmedSMS,
} from "@/services/NotificationService";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    await verifyToken(req);
    console.log("Order ID: " + params.orderId);
    const capchaToken = new URL(req.url).searchParams.get("capchaToken");
    const res = await verifyCaptchaToken(capchaToken);
    if (res) {
      await sendOrderConfirmedSMS(params.orderId);
      return new Response(
        JSON.stringify({
          status: true,
          message: "Notifications Send Successfully",
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          status: false,
          message: "Captcha verification failed",
        })
      );
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        messsage: error.message,
        status: false,
      }),
      { status: 405 }
    );
  }
}
