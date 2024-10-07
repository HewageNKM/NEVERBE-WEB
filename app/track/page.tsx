import React from 'react';
import Image from "next/image";
import {Logo} from "@/assets/images";
import Link from 'next/link';

const Page = () => {
    return (
        <main className="w-full h-full">
            <div className="p-8 flex flex-col justify-center items-center">
                <div className="justify-center gap-5 items-center flex flex-col">
                    <figure>
                        <Link href="/">
                            <Image src={Logo} alt={"Neverbe"} width={200} height={200}
                                   className="cursor-pointer md:h-56 md:w-56 h-36 w-36"/>
                        </Link>

                    </figure>
                    <h1 className="lg:text-4xl text-3xl text-center font-bold tracking-wide">Track Your Order
                        Status</h1>
                </div>
                <div className="mt-10">
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
                </div>
            </div>
        </main>
    );
};

export default Page;