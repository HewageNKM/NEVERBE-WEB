"use client";
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/firebase/firebaseClient";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/assets/images";
import toast from "react-hot-toast";
import ComponentLoader from "@/components/ComponentLoader";

const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // Simple sign in for existing users
      await signInWithPopup(auth, provider);
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push(redirectUrl);
    } catch (err: any) {
      let msg = "An error occurred. Please try again.";
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      )
        msg = "Invalid email or password.";
      else if (err.code === "auth/user-not-found")
        msg = "No account found with that email.";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4 font-sans selection:bg-gray-200 relative">
      {loading && <ComponentLoader />}
      <div className="mb-8 text-center flex flex-col items-center">
        <Link href="/" className="w-16 h-16 md:w-24 md:h-24 relative mb-4">
          <Image
            width={100}
            height={100}
            src={Logo}
            alt="NEVERBE Logo"
            className="w-full h-full object-contain hover:opacity-80 transition-opacity"
          />
        </Link>
        <h1 className="text-3xl font-bold uppercase tracking-tighter mb-2">
          Your Account
        </h1>
        <p className="text-gray-500 text-sm max-w-xs mx-auto text-center leading-relaxed">
          Sign in to access your orders, saved items and profile.
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            className="w-full p-3 border border-gray-300 focus:border-black outline-none rounded-none placeholder-gray-500 transition-colors"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 focus:border-black outline-none rounded-none placeholder-gray-500 transition-colors"
            onChange={handleChange}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-gray-500 underline underline-offset-4 hover:text-black"
            >
              Forgot your password?
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center leading-relaxed px-4">
            By logging in, you agree to our Privacy Policy and Terms of Use.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold uppercase tracking-wider py-3 mt-4 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Sign In"}
          </button>
        </form>

        {/* --- Divider --- */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-xs text-gray-500 font-medium">OR</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* --- Google Button --- */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full border border-gray-300 flex items-center justify-center gap-3 py-3 hover:border-black transition-colors bg-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-sm font-medium text-gray-600">
            Continue with Google
          </span>
        </button>

        {/* Toggle View */}
        <div className="text-center pt-2">
          <p className="text-gray-500 text-sm">
            Not a member?{" "}
            <Link
              href={`/account/register${
                redirectUrl !== "/account" ? `?redirect=${redirectUrl}` : ""
              }`}
              className="text-black font-medium underline underline-offset-4 hover:text-gray-600 ml-1"
            >
              Join Us.
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-black transition-colors uppercase tracking-widest border-b border-transparent hover:border-black pb-1"
        >
          ← Return to Store
        </Link>
      </div>
    </div>
  );
};

export default AuthPage;
