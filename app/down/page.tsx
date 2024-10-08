import React from 'react';
import Link from "next/link";
import {IoArrowBack} from "react-icons/io5";
import Image from "next/image";
import {Logo} from "@/assets/images";

const Page = () => {
    return (
        <main className="w-full bg-black h-screen flex justify-center items-center">
            <div className="p-8 flex text-white justify-center items-center flex-col">
                <figure>
                    <Image src={Logo} alt={"Logo"} width={200} height={200}/>
                </figure>
                <div className="mt-5 font-medium flex flex-col gap-2 items-center justify-center">
                    <h3 className="text-xl md:text-2xl capitalize text-slate-500">We will be back Soon</h3>
                    <p className="text-ll md:text-xl capitalize text-purple-500">We are improving our service right now.</p>
                    <div
                        className="text-xl md:text-3xl hover:-translate-x-1.5 gap-2 duration-200 transition-all font-medium flex flex-row items-center">
                        <IoArrowBack/>
                        <Link href="/shop">Shop</Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;