import {NextResponse} from "next/server";
import crypto from "crypto"


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

        const merchant_secret = process.env.PAYHERE_SANDBOX_MERCHANT_SECRET;

        const merchantHash = crypto
            .createHash('md5')
            .update(`${merchant_secret}`)
            .digest('hex').toString().toUpperCase();
        const local_md5sig = crypto
            .createHash('md5')
            .update(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${merchantHash}`)
            .digest('hex').toString().toUpperCase();

        console.log("/////////////////////////////////////////////////////////LOCAL MD5SIG/////////////////////////////////////////////////////////")
        console.log(local_md5sig)
        console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")

        console.log("/////////////////////////////////////////////////////////MD5SIG/////////////////////////////////////////////////////////")
        console.log(md5sig)
        console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")

        if (local_md5sig !== md5sig) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401})
        }


        if (status_code === '2') {
            console.log("/////////////////////////////////////////////////////////PAYMENT SUCCESSFUL/////////////////////////////////////////////////////////")
            console.log(`Merchant ID:${merchant_id}, Order ID:${order_id}, Payment ID:${payment_id}, Amount:${payhere_amount}, Currency:${payhere_currency}, Status Code:${status_code}, MD5Sig:${md5sig}, Method:${method}`)
            console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")

        } else if(status_code === '-2') {
            console.log("/////////////////////////////////////////////////////////PAYMENT FAILED/////////////////////////////////////////////////////////")
            console.log(`Merchant ID:${merchant_id}, Order ID:${order_id}, Payment ID:${payment_id}, Amount:${payhere_amount}, Currency:${payhere_currency}, Status Code:${status_code}, MD5Sig:${md5sig}, Method:${method}`)
            console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
            return NextResponse.json({message: 'Payment Failed'}, {status: 400})
        } else if(status_code == "-1") {
            console.log("/////////////////////////////////////////////////////////PAYMENT CANCELED/////////////////////////////////////////////////////////")
            console.log(`Merchant ID:${merchant_id}, Order ID:${order_id}, Payment ID:${payment_id}, Amount:${payhere_amount}, Currency:${payhere_currency}, Status Code:${status_code}, MD5Sig:${md5sig}, Method:${method}`)
            console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
            return NextResponse.json({message: 'Payment Canceled'}, {status: 400})

        }  else  if(status_code  == "-3"){
            console.log("/////////////////////////////////////////////////////////PAYMENT CHARGEDBACK/////////////////////////////////////////////////////////")
            console.log(`Merchant ID:${merchant_id}, Order ID:${order_id}, Payment ID:${payment_id}, Amount:${payhere_amount}, Currency:${payhere_currency}, Status Code:${status_code}, MD5Sig:${md5sig}, Method:${method}`)
            console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
            return NextResponse.json({message: 'Payment Pending'}, {status: 400})

        } else if(status_code == "0"){
            console.log("/////////////////////////////////////////////////////////PAYMENT PENDING/////////////////////////////////////////////////////////")
            console.log(`Merchant ID:${merchant_id}, Order ID:${order_id}, Payment ID:${payment_id}, Amount:${payhere_amount}, Currency:${payhere_currency}, Status Code:${status_code}, MD5Sig:${md5sig}, Method:${method}`)
            console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")
            return NextResponse.json({message: 'Payment Pending'}, {status: 400})
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

const updateTable = (orderId:string,paymentId:string) => {
    //update the table
    console.log("/////////////////////////////////////////////////////////UPDATING TABLE/////////////////////////////////////////////////////////")
    console.log(`Order ID:${orderId}, Payment ID:${paymentId}`)
    console.log("////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////")

}