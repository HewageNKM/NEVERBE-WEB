import React from 'react';

const TrackForm = () => {
    return (
        <section className="mt-10">
            <form className="flex flex-col gap-5">
                <label className="text-lg flex-col flex gap-1 font-semibold">
                    <span>Order ID</span>
                    <input placeholder="XXX-XXX-000" type="text"
                           className="p-2 border focus:outline-none  lg:w-[30rem] border-primary rounded-lg"/>
                </label>
                <label className="text-lg flex-col flex gap-1 font-semibold">
                    <span>Email</span>
                    <input type="email" placeholder="exmple@gmail.com"
                           className="p-2 border lg:w-[30rem] focus:outline-none border-primary rounded-lg"/>
                </label>
                <button className="bg-primary text-white font-medium p-2 rounded-lg">Track</button>
            </form>
        </section>
    );
};

export default TrackForm;