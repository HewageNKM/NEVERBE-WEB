import React from 'react';

const Skeleton = ({containerStyles}:{containerStyles:string}) => {
    return (
        <div className={`${containerStyles} animate-pulse bg-slate-200 rounded-lg`}/>
    );
};

export default Skeleton;