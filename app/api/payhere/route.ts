import {NextResponse} from "next/server";
import md5 from "crypto-js/md5";
import {deleteOrderByIdAndRestock, updatePayment} from "@/firebase/firebaseAdmin";


export async function POST(req: Request) {
    try {
        if (req.method !== 'POST') {
            return NextResponse.json({message: 'Method Not Allowed'}, {status: 405})
        }
        const body = await req.text();
        const {
            merchant_id,
            order_id,
            payment_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
            method
        } = decodeUrl(body);

        console.log("/////////////////////////////////////////////////////////REQUEST BODY/////////////////////////////////////////////////////////")
        console.log(`Merchant ID:${merchant_id}, Order ID:${order_id}, Payment ID:${payment_id}, Amount:${payhere_amount}, Currency:${payhere_currency}, Status Code:${status_code}, MD5Sig:${md5sig}, Method:${method}`)
        console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")

        const merchantSecret = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;
        const hashedSecret = md5(merchantSecret).toString().toUpperCase();

        const local_md5sig  = md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret).toString().toUpperCase();

        console.log("/////////////////////////////////////////////////////////LOCAL MD5SIG/////////////////////////////////////////////////////////")
        console.log(local_md5sig)
        console.log("/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")

        console.log("/////////////////////////////////////////////////////////MD5SIG//////////////////////////////////////////////////////////////")
        console.log(md5sig)
        console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")

        if (local_md5sig !== md5sig) {
            return NextResponse.json({message: 'Unauthorized Different Signatures'}, {status: 401})
        }


        if (status_code === '2') {
            console.log("/////////////////////////////////////////////////////////PAYMENT SUCCESSFUL/////////////////////////////////////////////////////////")
            console.log(`Merchant ID:${merchant_id}, Order ID:${order_id}, Payment ID:${payment_id}, Amount:${payhere_amount}, Currency:${payhere_currency}, Status Code:${status_code}, MD5Sig:${md5sig}, Method:${method}`)
            console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
            await updatePayment(order_id, payment_id, "Paid")

            return NextResponse.json({message: `Payment Successful ${status_code}`}, {status: 200})
        } else {
            console.log("/////////////////////////////////////////////////////////PAYMENT FAILED/////////////////////////////////////////////////////////")
            console.log(`Merchant ID:${merchant_id}, Order ID:${order_id}, Payment ID:${payment_id}, Amount:${payhere_amount}, Currency:${payhere_currency}, Status Code:${status_code}, MD5Sig:${md5sig}, Method:${method}`)
            console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
            await updatePayment(order_id, payment_id, "Failed")

            return NextResponse.json({message: `Payment Failed ${status_code}`}, {status: 400})
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json({message: "Error"}, {status: 500})
    }
}

const decodeUrl = (body: any) => {
    const params = new URLSearchParams(body);

    const merchant_id = params.get('merchant_id');
    const order_id = params.get('order_id');
    const payment_id = params.get('payment_id');
    const payhere_amount = params.get('payhere_amount');
    const payhere_currency = params.get('payhere_currency');
    const status_code = params.get('status_code');
    const md5sig = params.get('md5sig');
    const method = params.get('method');

    return {
        merchant_id,
        order_id,
        payment_id,
        payhere_amount,
        payhere_currency,
        status_code,
        md5sig,
        method,
    }
}
