import React, {ReactNode} from 'react';

const DropShadow = ({containerStyle,children,onClick}:{containerStyle:string,children:ReactNode,onClick?:()=>void}) => {
    return (
        <div onClick={onClick} className={`fixed top-0 left-0 bg-black z-50 bg-opacity-60 w-[100vw] min-h-screen ${containerStyle}`}>
            {children}
        </div>
    );
};

export default DropShadow;