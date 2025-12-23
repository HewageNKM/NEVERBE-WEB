"use client";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/firebase/firebaseClient";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/assets/images";
import toast from "react-hot-toast";
import ComponentLoader from "@/components/ComponentLoader";
import { motion } from "framer-motion";
import { IoChevronBackOutline, IoArrowForwardOutline } from "react-icons/io5";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        try {
          await linkWithPopup(auth.currentUser, provider);
          toast.success("ACCOUNT SYNCED SUCCESSFULLY");
          router.push(redirectUrl);
          return;
        } catch (linkError: any) {
          toast.error("LINK ERROR: ACCOUNT ALREADY IN USE");
          setLoading(false);
          return;
        }
      }
      await signInWithPopup(auth, provider);
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error("GOOGLE SIGN-IN FAILED");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (user && user.isAnonymous) {
        const credential = EmailAuthProvider.credential(
          formData.email,
          formData.password
        );
        await linkWithCredential(user, credential);
        await updateProfile(user, {
          displayName: `${formData.firstName} ${formData.lastName}`.trim(),
        });
        toast.success("MEMBER REGISTERED & HISTORY SAVED");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        await updateProfile(userCredential.user, {
          displayName: `${formData.firstName} ${formData.lastName}`.trim(),
        });
        toast.success("WELCOME TO NEVERBE");
      }
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error("REGISTRATION FAILED. PLEASE CHECK DETAILS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-6 selection:bg-[#97e13e]/30 relative">
      {loading && <ComponentLoader />}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="mb-12 text-center flex flex-col items-center">
          <Link href="/" className="mb-10 transition-opacity hover:opacity-70">
            <Image src={Logo} width={130} height={45} alt="NEVERBE" priority />
          </Link>

          <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter mb-4">
            Become a Member
          </h1>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[300px]">
            Create your profile to unlock exclusive gear, faster checkout, and
            performance tracking.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              required
              className="w-full bg-zinc-50 p-4 text-sm font-bold border border-zinc-200 focus:border-black focus:bg-white outline-none rounded-2xl transition-all placeholder:text-zinc-400"
              onChange={handleChange}
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              required
              className="w-full bg-zinc-50 p-4 text-sm font-bold border border-zinc-200 focus:border-black focus:bg-white outline-none rounded-2xl transition-all placeholder:text-zinc-400"
              onChange={handleChange}
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            className="w-full bg-zinc-50 p-4 text-sm font-bold border border-zinc-200 focus:border-black focus:bg-white outline-none rounded-2xl transition-all placeholder:text-zinc-400"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password (Min. 6 Characters)"
            required
            className="w-full bg-zinc-50 p-4 text-sm font-bold border border-zinc-200 focus:border-black focus:bg-white outline-none rounded-2xl transition-all placeholder:text-zinc-400"
            onChange={handleChange}
          />

          <p className="text-[11px] text-zinc-400 text-center uppercase font-black tracking-widest leading-relaxed py-4 px-6">
            By joining, you agree to our Privacy Policy and Terms of Use.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-black text-white py-5 rounded-full font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-black/5"
          >
            {loading ? "Processing..." : "Create Account"}
            <IoArrowForwardOutline
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        {/* --- Divider --- */}
        <div className="flex items-center gap-6 my-10">
          <div className="h-px bg-zinc-100 flex-1"></div>
          <span className="text-[10px] font-black text-zinc-300 tracking-widest uppercase">
            Or
          </span>
          <div className="h-px bg-zinc-100 flex-1"></div>
        </div>

        {/* --- Google Button: Branded Accent --- */}
        <button
          onClick={handleGoogleRegister}
          type="button"
          className="w-full bg-[#97e13e] text-black flex items-center justify-center gap-4 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-[#97e13e]/20 hover:scale-[1.02] transition-all active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="black"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="black"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
              fill="black"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="black"
            />
          </svg>
          Register with Google
        </button>

        {/* Login Link */}
        <div className="text-center mt-12">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wide">
            Already a member?{" "}
            <Link
              href={`/account/login${
                redirectUrl !== "/account" ? `?redirect=${redirectUrl}` : ""
              }`}
              className="text-black font-black underline underline-offset-8 decoration-[#97e13e] decoration-4 hover:decoration-black transition-all ml-1"
            >
              Sign In.
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Return Home */}
      <div className="mt-16 relative z-10">
        <Link
          href="/"
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-all"
        >
          <IoChevronBackOutline size={14} />
          Back to store
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
