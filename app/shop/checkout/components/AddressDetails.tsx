"use client"
import Address from "@/app/shop/checkout/components/Address";

const AddressDetails = () => {
    return (
        <section className="flex flex-col">
            <Address />
            <div className="flex flex-row items-center gap-2 justify-start mt-2">
                <input type="checkbox" className="bg-primary text-white rounded-lg"/>
                <p className="text-lg">Save this address for future purchases</p>
            </div>
        </section>
    );
};

export default AddressDetails;