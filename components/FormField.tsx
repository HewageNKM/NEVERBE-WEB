import React from 'react';

const FormField = ({otherStyles, placeholder, containerStyles: containerStyles}: {
    otherStyles: string,
    placeholder: string,
    containerStyles: string
}) => {
    return (
        <div className={` ${containerStyles}`}>
            <input placeholder={placeholder} className={`bg-gray-100 text-sm font-medium rounded-2xl ${otherStyles}`}
                   type="text"/>
        </div>
    );
};

export default FormField;