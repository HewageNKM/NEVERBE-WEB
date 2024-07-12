import React from 'react';

const FormField = ({otherStyle,placeholder}) => {
    return (
        <div>
            <input placeholder={placeholder} className={`bg-gray-100 text-sm font-medium rounded-2xl ${otherStyle}`} type="text"/>
        </div>
    );
};

export default FormField;