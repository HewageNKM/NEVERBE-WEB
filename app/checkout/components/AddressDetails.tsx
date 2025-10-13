import React from "react";
import { Customer } from "@/interfaces";

const AddressDetails = ({
                            saveAddress,
                            setSaveAddress,
                            customer
                        }: {
    saveAddress: boolean,
    setSaveAddress: React.Dispatch<React.SetStateAction<boolean>>,
    customer: Customer
}) => {
    return (
        <div className="flex flex-col items-start px-4 py-8">
            <h1 className="lg:text-4xl text-3xl font-bold tracking-wide">Address Details</h1>
            <div className="flex flex-col gap-4 mt-10 w-full">
                <div className="flex flex-row flex-wrap gap-4 w-full">
                    <label className="flex flex-col gap-2 w-full md:w-[48%]">
                        <span className="font-medium md:text-xl text-lg">*First Name</span>
                        <input
                            placeholder="Sandun"
                            type="text"
                            defaultValue={customer?.name.split(" ")[0]}
                            className="px-4 py-2 focus:outline-none rounded-lg border-slate-300 border-2"
                            required
                            name="first_name"
                        />
                    </label>

                    <label className="flex flex-col gap-2 w-full md:w-[48%]">
                        <span className="font-medium md:text-xl text-lg">*Last Name</span>
                        <input
                            placeholder="Dilhan"
                            type="text"
                            defaultValue={customer?.name.split(" ")[1]}
                            className="px-4 py-2 focus:outline-none rounded-lg border-slate-300 border-2"
                            required
                            name="last_name"
                        />
                    </label>
                </div>

                <label className="flex flex-col gap-2 w-full">
                    <span className="font-medium md:text-xl text-lg">*Email</span>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        defaultValue={customer?.email}
                        className="px-4 py-2 focus:outline-none rounded-lg border-slate-300 border-2"
                        required
                        name="email"
                    />
                </label>

                <label className="flex flex-col gap-2 w-full">
                    <span className="font-medium md:text-xl text-lg">*Mobile</span>
                    <input
                        placeholder="0777668765"
                        type="text"
                        defaultValue={customer?.phone}
                        className="px-4 py-2 focus:outline-none border-slate-300 rounded-lg border-2"
                        required
                        name="phone"
                    />
                </label>

                <label className="flex flex-col gap-2 w-full">
                    <span className="font-medium md:text-xl text-lg">*Address</span>
                    <input
                        type="text"
                        placeholder="98/1A, Ingiriya"
                        defaultValue={customer?.address}
                        className="px-4 py-2 focus:outline-none border-slate-300 rounded-lg border-2"
                        required
                        name="address"
                    />
                </label>

                <label className="flex flex-col gap-2 w-full md:w-[48%]">
                    <span className="font-medium md:text-xl text-lg">*City</span>
                    <input
                        type="text"
                        placeholder="Dompe"
                        defaultValue={customer?.city}
                        className="px-4 py-2 border-slate-300 focus:outline-none rounded-lg border-2"
                        required
                        name="city"
                    />
                </label>

                <label className="flex flex-col gap-2 w-full md:w-[48%]">
                    <span className="font-medium md:text-xl text-lg">Postal Code</span>
                    <input
                        type="text"
                        placeholder="11700"
                        defaultValue={customer?.zip}
                        className="px-4 py-2 border-slate-300 focus:outline-none rounded-lg border-2"
                        name="zip"
                    />
                </label>

                <label className="flex flex-col gap-2 w-full md:w-[48%]">
                    <span className="font-medium md:text-xl text-lg">*Country</span>
                    <input
                        disabled
                        className="px-4 py-2 rounded-lg border-slate-300 focus:outline-none border-2"
                        name="country"
                        value="Sri Lanka"
                    />
                </label>
            </div>

            <div className="flex flex-row items-center gap-3 justify-start mt-5">
                <input
                    name="saveAddress"
                    defaultChecked={saveAddress}
                    onChange={() => setSaveAddress(prevState => !prevState)}
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary focus:ring focus:ring-primary/50"
                />
                <p className="text-lg">Save this address for future purchases</p>
            </div>
        </div>
    );
};

export default AddressDetails;
