import React, {useState} from 'react';
import Image from "next/image";
import {facebook, google} from "@/assets";
import FormField from "@/components/FormField";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {setState} from "@/lib/features/authSlice/authSlice";

const Index = () => {
    const state = useSelector((state:RootState) => state.authSlice.state);
    const dispatch:AppDispatch = useDispatch();
    return (
        <div className="w-full min-h-screen gap-5 justify-center items-center flex flex-col">
            <div className="mx-auto my-auto flex flex-col gap-8">
                <h1 className="font-bold text-3xl">{state ? "Create Account":"Login"} </h1>
                <div className="flex flex-col gap-2 justify-start">
                    <form className="flex gap-3 flex-col">
                        {state && (
                            <label className="font-medium">
                                Username*
                                <FormField required={true} otherStyles="p-2 w-full" placeholder="Username"
                                           containerStyles="md:w-[25vw]"/>
                            </label>
                        )}
                        <label className="font-medium">
                            Email*
                            <FormField required={true} otherStyles="p-2 w-full" placeholder="Email" containerStyles="md:w-[25vw]"/>
                        </label>
                        <label className="font-medium">
                            Password*
                            <FormField required={true} otherStyles="p-2 w-full" placeholder="Password" containerStyles="md:w-[25vw]"/>
                        </label>
                        <button type="submit" className="bg-black text-white p-2 w-[25vw] hover:opacity-80 font-semibold rounded-md">
                            {state ? "Create Account" : "Login"}
                        </button>
                        <div className="relative">
                            <div className="h-[0.2px] bg-slate-400">
                            </div>
                            <p className="absolute -top-2 left-[36%] bg-white text-slate-600 text-xs font-medium">Or
                                Continue With</p>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-12">
                            <button>
                                <Image src={google} alt="facebook" className="w-8 h-8"/>
                            </button>
                            <button>
                                <Image src={facebook} alt="facebook" className="w-8 h-8"/>
                            </button>
                        </div>
                        <div>
                            <p className="text-center">{state ? "Doesn't" : "Does "} have an account? <button
                                type="button"
                                onClick={() => dispatch(setState(!state))}
                                className="text-blue-500">{state ? "Sign Up" : "Login"}</button></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Index;