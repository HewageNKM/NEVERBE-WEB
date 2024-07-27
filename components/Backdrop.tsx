import React, {ReactNode} from 'react';
import {motion} from "framer-motion";

const Backdrop = ({onClick, children}: { children: ReactNode }) => {
    return (
        <motion.div onClick={onClick} initial={{opacity: 0}} animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="w-[100%] z-50 fixed top-0 left-0 flex justify-center items-center h-[100%] bg-opacity-70 bg-black">
            {children}
        </motion.div>
    );
};

export default Backdrop;