import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {Logo} from "@/assets/images";

const Header = () => {
    return (
        <section className="justify-center gap-5 items-center flex flex-col">
            <figure>
                <Link href="/">
                    <Image src={Logo} alt={"Neverbe"} width={200} height={200}
                           className="cursor-pointer md:h-56 md:w-56 h-36 w-36"/>
                </Link>
            </figure>
            <h1 className="lg:text-4xl text-3xl text-center font-bold tracking-wide">Track Your Order
                Status</h1>
        </section>
    );
};

export default Header;