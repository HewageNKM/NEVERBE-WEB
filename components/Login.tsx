"use client";
import React, {useState} from "react";
import DropShadow from "@/components/DropShadow";
import {motion} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {IoClose} from "react-icons/io5";
import {setShowLoginForm} from "@/redux/authSlice/authSlice";
import {
    EmailAuthProvider,
    getAuth,
    GoogleAuthProvider,
    linkWithCredential,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";

const Login = () => {
    const user = useSelector((state: RootState) => state.authSlice.user);
    const dispatch: AppDispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const inputStyles =
        "border p-3 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full";
    const gradientText =
        "bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const auth = getAuth();

        if (user?.isAnonymous) {
            const credential = EmailAuthProvider.credential(email, password);
            try {
                await linkWithCredential(auth.currentUser!, credential);
                setSuccess("Account successfully converted to a permanent account!");
                setError(null);
                closeForm()
            } catch (err: any) {
                setError(err.message);
                setSuccess(null);
            }
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                setSuccess("Logged in successfully!");
                setError(null);
                closeForm()
            } catch (err: any) {
                setError(err.message);
                setSuccess(null);
            }
        }
    };

    const handleThirdPartyLogin = async (provider: any) => {
        const auth = getAuth();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if the user is anonymous
            if (user.isAnonymous) {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                await linkWithCredential(user, credential!);
                setSuccess("Account successfully converted to a permanent account with Google!");
            } else {
                setSuccess("Logged in successfully with Google!");
            }
            setError(null);
            closeForm()
        } catch (err: any) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const closeForm = () => {
        setTimeout(() => {
            dispatch(setShowLoginForm(false));
        },3000)
    }
    return (
        <DropShadow containerStyle="flex justify-center items-center">
            <motion.div className="h-screen w-screen flex justify-center items-center">
                <div className="md:max-w-md w-full px-4 relative">
                    <div className="bg-white shadow-lg rounded-[20px] p-6 sm:p-8">
                        <h1 className="pb-6 font-bold text-gray-800 lg:text-5xl text-3xl text-center cursor-default">
                            {user?.isAnonymous ? "Sign Up" : "Log in"}
                        </h1>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        {success && <p className="text-green-500 text-center">{success}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 text-gray-800 text-lg block"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    className={inputStyles}
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 text-gray-800 text-lg block"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    className={inputStyles}
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <a
                                className="group text-blue-400 transition-all duration-100 ease-in-out"
                                href="#"
                            >
                                <span className={gradientText}>Forget your password?</span>
                            </a>
                            <button
                                className="bg-gradient-to-r text-white from-primary-100 to-purple-500 shadow-lg mt-6 p-2 rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                                type="submit"
                            >
                                {user?.isAnonymous ? "Sign Up" : "Log in"}
                            </button>
                        </form>
                        <div className="flex flex-col mt-4 items-center justify-center text-sm">
                            <h3 className="text-gray-800">
                                <span>Don&apos;t have an account? </span>
                                <span className="group transition-all duration-100 ease-in-out">Continue with</span>
                            </h3>
                        </div>
                        {/* Third Party Authentication Options */}
                        <div
                            id="third-party-auth"
                            className="flex items-center justify-center mt-5 flex-wrap gap-2"
                        >
                            <button
                                className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg"
                                onClick={() => handleThirdPartyLogin(new GoogleAuthProvider())}
                            >
                                <Image
                                    width={30}
                                    height={30}
                                    className="max-w-[25px]"
                                    src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                                    alt="Google"
                                />
                            </button>
                        </div>
                        <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm">
                            <p className="cursor-default">
                                By signing in, you agree to our {" "}
                                <Link
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                                    href={"/policies/privacy-policy"}
                                >
                                    <span className={gradientText}>Terms</span>
                                </Link>{" "}
                                and {" "}
                                <Link
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                                    href={"/policies/privacy-policy"}
                                >
                                    <span className={gradientText}>Privacy Policy</span>
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="absolute top-3 right-6">
                        <button
                            onClick={() => dispatch(setShowLoginForm(false))}
                        >
                            <IoClose size={25}/>
                        </button>
                    </div>
                </div>
            </motion.div>
        </DropShadow>
    );
};

export default Login;
