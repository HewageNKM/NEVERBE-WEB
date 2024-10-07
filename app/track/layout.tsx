import React, {ReactNode} from 'react';
import Footer from "@/components/Footer";

const Layout = ({children}: { children: ReactNode }) => {
    return (
        <main className="w-full min-h-screen flex flex-col justify-between">
            {children}
            <Footer/>
        </main>
    );
};

export default Layout;