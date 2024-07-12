import React from 'react';
import {useRouter} from "next/router";

const Product = () => {
    const router = useRouter();
    return (
        <div>
            <h1>{router.query.product}</h1>
        </div>
    );
};

export default Product;