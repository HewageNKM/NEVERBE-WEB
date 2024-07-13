import React from 'react';
import Image from "next/image";


const CustomButton = ({title,imageUrl,containerStyles,buttonStyles}) => {
    return (
        <div className={containerStyles}>
            <button className={buttonStyles}>
                {title}
                {imageUrl && <Image src={imageUrl} alt={title} />}
            </button>
        </div>
    );
};

export default CustomButton;