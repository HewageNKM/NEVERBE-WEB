import React from "react";

const AddressDetails = ({
                            saveAddress,
                            setSaveAddress
                        }:{
    saveAddress: boolean,
    setSaveAddress: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <div className="flex flex-col items-start">
            <h1 className="lg:text-4xl text-3xl font-bold tracking-wide">Address Details</h1>
            <div className="flex flex-col gap-3 mt-10">
                <div className="flex flex-row flex-wrap gap-2">
                    <label className="flex flex-col gap-1">
                        <span className="font-medium md:text-xl text-lg">First Name</span>
                        <input placeholder="Sandun" type="text" className="px-2 py-1 focus:outline-none rounded-lg border-slate-300 border-2" required
                               name="first_name"/>
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="font-medium md:text-xl text-lg">Last Name</span>
                        <input placeholder="Dilhan" type="text" className="px-2 py-1 focus:outline-none rounded-lg border-slate-300 border-2" required name="last_name"/>
                    </label>
                </div>

                <label className="flex flex-col gap-1">
                    <span className="font-medium md:text-xl text-lg">Email</span>
                    <input type="email" placeholder="example@gmail.com" className="px-2 focus:outline-none rounded-lg py-1 border-slate-300 border-2" required name="email"/>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="font-medium md:text-xl text-lg">Phone</span>
                    <input placeholder="+94 777 668 765" type="text" className="px-2 py-1 focus:outline-none border-slate-300 rounded-lg border-2" required name="phone"/>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="font-medium md:text-xl text-lg">Address</span>
                    <input type="text" placeholder="98/1A, Ingiriya" className="px-2 py-1 focus:outline-none border-slate-300 rounded-lg border-2" required name="address"/>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="font-medium md:text-xl text-lg">City</span>
                    <input type="text" placeholder="Dompe" className="px-2 py-1 border-slate-300 focus:outline-none rounded-lg border-2" required name="city"/>
                </label>

                <label className="flex flex-col gap-1">
                    <label className="font-medium md:text-xl text-lg">Country</label>
                    <input disabled className="px-2 py-1 rounded-lg border-slate-300 focus:outline-none border-2" name="country" value="Sri Lanka"/>
                </label>

                <input type="hidden" name="merchant_id"/>
                <input type="hidden" name="return_url"/>
                <input type="hidden" name="cancel_url"/>
                <input type="hidden" name="notify_url"/>
                <input type="hidden" name="hash"/>
                <input type="hidden" name="order_id"/>
                <input type="hidden" name="items"/>
                <input type="hidden" name="currency"/>
                <input type="hidden" name="amount"/>
            </div>
            <div className="flex flex-row items-center gap-2 justify-start mt-2">
                <input name="saveAddress"
                       defaultChecked={saveAddress}
                          onChange={()=>setSaveAddress(prevState => !prevState)}
                       type="checkbox" className="bg-primary text-white rounded-lg"/>
                <p className="text-lg">Save this address for future purchases</p>
            </div>
        </div>
    )

};

export default AddressDetails;