import React from 'react';
import ShoeCard from "@/components/ShoeCard";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";

const Accessories = ({containerStyles}:{containerStyles:string}) => {
    let accessories = useSelector((state:RootState) => state.accessoriesSlice.accessories);
    return (
        <div className={`mt-10 ${containerStyles}`}>
            <div className={`mt-20 ${containerStyles}`}>
                <div className="flex w-full flex-col items-center justify-center">
                    <h1 className="font-bold text-5xl ">
                        Accessories
                    </h1>
                    <div>
                        <p className="text-sm flex flex-wrap md:text-lg m-2 text-slate-500">
                            Get your favorite accessories here
                        </p>
                    </div>
                    <div className="w-[22vw] h-[1.8px] bg-primary-100"/>
                </div>
            </div>
            <div className="flex-col mt-8 justify-center items-center flex gap-10">
                <div className="flex-row justify-center flex-wrap flex md:gap-10 gap-20 items-center">
                    {accessories.length > 0 ? accessories.map((shoe, index) => (
                        <div key={index}>Hi</div>
                    )) : (<EmptyState title="Opps!" subTitle="No Accessories Found"/>)}
                </div>
                {accessories.length > 20 && <Button title="Load More" containerStyles=""/>}
            </div>
        </div>
    );
};

export default Accessories;