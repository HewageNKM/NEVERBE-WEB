import React from 'react';
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-black relative mt-20">
            <div className="text-white flex-row h-[2.7rem] p-2 flex gap-3">
                <p>
                    © {new Date().getFullYear().toString()} Never Be All Right Reserved.
                </p>
                <Link href="" className="hover:border-b border-white">Terms & Conditions</Link>
            </div>
        </footer>
    );
}

export default Footer;