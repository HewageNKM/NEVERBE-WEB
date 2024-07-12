import React from 'react';

const FormField = ({otherStyle,placeholder,containerStles}) => {
    return (
        <div className={` ${containerStles}`}>
            <input placeholder={placeholder} className={`bg-gray-100 text-sm font-medium rounded-2xl ${otherStyle}`} type="text"/>
        </div>
    );
};

export default FormField;