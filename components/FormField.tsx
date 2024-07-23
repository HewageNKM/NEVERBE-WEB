import React from 'react';

const FormField = ({otherStyles, placeholder, containerStyles: containerStyles, required}: {
    otherStyles: string,
    placeholder: string,
    containerStyles: string
    required?: boolean
}) => {
    return (
        <div className={` ${containerStyles}`}>
            <input required={required} placeholder={placeholder} className={`bg-gray-100 text-sm font-medium rounded-2xl ${otherStyles}`}
                   type="text"/>
        </div>
    );
};

export default FormField;