import React from 'react';
import {useRouter} from "next/router";

const Phrase = () => {
    const router = useRouter();
    return (
        <div>
            <h1>{router.query.phrase}</h1>
        </div>
    );
};

export default Phrase;