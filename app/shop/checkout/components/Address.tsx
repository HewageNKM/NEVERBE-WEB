import React from 'react';

const Address = () => {
    return (
        <div>
            <form className="flex flex-col gap-5">
                <legend className="lg:text-4xl text-3xl font-bold tracking-wide">Address Details</legend>
                <div className="flex mt-5 flex-row flex-wrap gap-5">
                    <label className="flex flex-col gap-1">
                        <span className="text-lg">First Name</span>
                        <input name="fName" required type="text" placeholder="Sandun"
                               className="p-2 rounded-lg border-slate-200 border-2 focus:outline-primary"/>
                    </label>
                    <label className="flex  flex-col gap-1">
                        <span className="text-lg">Last Name</span>
                        <input name="lName" required type="text" placeholder="Dilshan"
                               className="p-2 rounded-lg border-slate-200 border-2 focus:outline-primary"/>
                    </label>
                </div>
                <div className="flex flex-col gap-5">
                    <label className="flex flex-col gap-1">
                        <span className="text-lg">Mobile Number</span>
                        <input name="phone" required type="text" placeholder="Mobile"
                               className="p-2 rounded-lg border-slate-200 border-2 focus:outline-primary"/>
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-lg">Email</span>
                        <input name="email" required type="text" placeholder="Email"
                               className="p-2 rounded-lg border-slate-200 border-2 focus:outline-primary"/>
                    </label>
                </div>
                <div className="flex flex-col gap-5">
                    <label className="flex flex-col gap-1">
                        <span className="text-lg">Address Line 1</span>
                        <input name="address1" required type="text" placeholder="AddressDetails Line 1"
                               className="p-2  rounded-lg border-slate-200 border-2 focus:outline-primary"/>
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-lg">Address Line 2</span>
                        <input name="address2" required type="text" placeholder="AddressDetails Line 2"
                               className="p-2 rounded-lg border-slate-200 border-2 focus:outline-primary"/>
                    </label>
                </div>
                <div className="flex flex-col gap-5">
                    <label className="flex flex-col gap-1">
                        <span className="text-lg">City/Town</span>
                        <input name="city" required type="text" placeholder="City"
                               className="p-2 rounded-lg border-slate-200 border-2 focus:outline-primary"/>
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-lg">Zip/Postal Code</span>
                        <input name="zipCode" required type="text" placeholder="City"
                               className="p-2 rounded-lg border-slate-200 border-2 focus:outline-primary"/>
                    </label>
                </div>
            </form>
        </div>
    );
};

export default Address;