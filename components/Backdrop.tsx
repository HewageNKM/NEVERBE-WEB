import React, {ReactNode} from 'react';
import {motion} from "framer-motion";

const Backdrop = ({onClick, children, containerStyles}: { children: ReactNode, containerStyles: string }) => {
    return (
        <motion.div onClick={onClick} initial={{opacity: 0}} animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className={`${containerStyles}`}>
            {children}
        </motion.div>
    );
};

export default Backdrop;