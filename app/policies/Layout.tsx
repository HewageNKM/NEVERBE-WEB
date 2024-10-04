import React, {ReactNode} from 'react';
import Footer from "@/components/Footer";

const Layout = ({children}:{children:ReactNode}) => {
    return (
        <div className="min-h-screen relative flex-col justify-between flex w-full">
            {children}
            <Footer/>
        </div>
    );
};

export default Layout;