import React from 'react';
import Image from "next/image";


const BorderButton = ({title, imageUrl, containerStyles, buttonStyles}: {
    title: string,
    imageUrl: string,
    containerStyles: string,
    buttonStyles: string
}) => {
    return (
        <div className={containerStyles}>
            <button className={buttonStyles}>
                {title}
                {imageUrl && <Image src={imageUrl} alt={title}/>}
            </button>
        </div>
    );
};

export default BorderButton;