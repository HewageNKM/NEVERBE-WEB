import React, {useEffect, useState} from 'react';
import {PaymentMethod} from "@/interfaces";
import {getWebsitePaymentMethods} from "@/actions/paymentMethodsAction";

const PaymentOptions = ({setPaymentType, paymentType}: {
    setPaymentType: React.Dispatch<React.SetStateAction<string>>,
    paymentType: string,
}) => {
    const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>([])

    useEffect(() => {
        fetchPaymentMethods()
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            const methods: PaymentMethod[] = await getWebsitePaymentMethods();
            setPaymentOptions(methods)
            setPaymentType(methods[0].name || "")
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <ul className="mt-5 flex flex-col gap-6">
            {paymentOptions.map((option, index) => (
                <li
                    onClick={() => setPaymentType(option.name)}
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg shadow-sm transition-all hover:shadow-md hover:bg-gray-50 cursor-pointer"
                >
                    <input
                        defaultChecked={option.name === paymentType}
                        type="radio"
                        name="payment"
                        value={option.name}
                        className="form-radio h-5 w-5 text-primary focus:ring-primary"
                    />
                    <div>
                        <label htmlFor="payment" className="text-gray-800 text-lg font-semibold">
                            {option.name}
                        </label>
                        {option?.description &&
                            <p className="text-gray-500 text-sm font-medium">{option?.description}</p>}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default PaymentOptions;