import React, {ReactNode} from 'react';

const DropShadow = ({containerStyle,children}:{containerStyle:string,children:ReactNode}) => {
    return (
        <div className={`fixed bg-black z-50 bg-opacity-60 w-full min-h-screen ${containerStyle}`}>
            {children}
        </div>
    );
};

export default DropShadow;