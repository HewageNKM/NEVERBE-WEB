import React from 'react';
import Backdrop from "@/components/Backdrop";
import FormField from "@/components/FormField";
import Image from "next/image";
import {facebook, google} from "@/assets";
import {setState} from "@/lib/features/authSlice/authSlice";
import {motion} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {Button} from "@mui/material";
import {closeLoginDialog} from "@/lib/features/headerSlice/headerSlice";

const LoginModel = () => {
    const state = useSelector((state: RootState) => state.authSlice.state);
    const dispatch: AppDispatch = useDispatch();
    return (
        <Backdrop>
            <motion.div exit={{opacity: 0, x: '100vw'}} initial={{x: "-100vw", opacity: 0}}
                        animate={{opacity: 1, x: 0, transition: {type: "spring", stiffness: 200, damping: 20}}}
                        className="justify-center bg-white px-8 py-4 rounded-lg relative w-[80vw] md:w-[30vw] items-center flex flex-col gap-8">
                <h1 className="font-bold text-xl md:text-3xl">{state ? "Create Account" : "Login"} </h1>
                <div className="flex flex-col gap-2 justify-start">
                    <form className="flex gap-2 md:gap-3 flex-col">
                        {state && (
                            <label className="font-medium text-sm md:text-lg">
                                Username*
                                <FormField required={true} otherStyles="p-2 w-full" placeholder="Username"
                                           containerStyles="md:w-[25vw]"/>
                            </label>
                        )}
                        <label className="font-medium text-sm md:text-lg">
                            Email*
                            <FormField required={true} otherStyles="p-2 w-full" placeholder="Email"
                                       containerStyles="md:w-[25vw]"/>
                        </label>
                        <label className="font-medium text-sm md:text-lg">
                            Password*
                            <FormField required={true} otherStyles="p-2 w-full" placeholder="Password"
                                       containerStyles="md:w-[25vw]"/>
                        </label>
                        <Button type="submit"
                                className="bg-primary text-sm md:text-lg text-white p-2 md:w-[25vw] w-full hover:bg-primary-100 font-semibold rounded-md">
                            {state ? "Create Account" : "Login"}
                        </Button>
                        <div className="relative">
                            <div className="h-[0.2px] bg-slate-400">
                            </div>
                            <p className="absolute -top-2 left-[28%] md:left-[36%] bg-white text-slate-600 text-xs font-medium">Or
                                Continue With</p>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-12">
                            <Button>
                                <Image src={google} alt="facebook" className="w-8 h-8"/>
                            </Button>
                            <Button>
                                <Image src={facebook} alt="facebook" className="w-8 h-8"/>
                            </Button>
                        </div>
                        <div>
                            <p className="text-sm md:text-lg text-center">{state ? "Doesn't" : "Does "} have an account? <button
                                type="button"
                                onClick={() => dispatch(setState(!state))}
                                className="text-blue-500">{state ? "Sign Up" : "Login"}</button></p>
                        </div>
                    </form>
                </div>
                <Button onClick={() => {
                    dispatch(closeLoginDialog())
                }}
                        className="text-black rounded-full w-fit h-fit font-bold text-lg absolute right-0 top-1 hover:bg-white">
                    X
                </Button>
            </motion.div>
        </Backdrop>
    );
};

export default LoginModel;