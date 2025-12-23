"use client";
import React, { useState } from "react";
import {
  updatePassword,
  updateProfile,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "@/firebase/firebaseClient";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice/authSlice";
import { motion } from "framer-motion";
import {
  IoShieldCheckmarkOutline,
  IoPersonOutline,
  IoKeyOutline,
  IoFingerPrintOutline,
  IoPulseOutline,
} from "react-icons/io5";

const AccountSettings = ({ user, dispatch }: { user: any; dispatch: any }) => {
  // Logic for the visual "Serial Number" based on UID
  const memberSerial = user?.uid
    ? `NB-${user.uid.slice(0, 8).toUpperCase()}`
    : "NB-PENDING";

  const ProfileForm = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsUpdating(true);
      const formData = new FormData(e.currentTarget);
      const fName = formData.get("fName") as string;
      const lName = formData.get("lName") as string;

      try {
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: `${fName} ${lName}`.trim(),
          });
          await auth.currentUser.reload();
          toast.success("BLUEPRINT SYNCED", {
            style: {
              background: "#1a1a1a",
              color: "#97e13e",
              fontSize: "12px",
              fontWeight: "900",
            },
          });

          const updatedUser = {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
            phoneNumber: auth.currentUser.phoneNumber,
            providerId: auth.currentUser.providerId,
            emailVerified: auth.currentUser.emailVerified,
            isAnonymous: auth.currentUser.isAnonymous,
            memberSince: auth.currentUser.metadata.creationTime,
          };
          dispatch(setUser(updatedUser));
        }
      } catch (err: any) {
        toast.error("SYNC ERROR: " + err.message);
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <div className="animate-fade">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <IoPersonOutline className="text-accent" size={20} />
              </div>
              <h3 className="text-xl font-display font-black uppercase italic tracking-tighter text-inverse">
                Member Blueprint
              </h3>
            </div>
            <div className="hidden md:block">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">
                Serial:{" "}
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent italic">
                {memberSerial}
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                  First Name
                </label>
                <input
                  name="fName"
                  type="text"
                  defaultValue={
                    user.displayName ? user.displayName.split(" ")[0] : ""
                  }
                  className="w-full bg-surface-2 p-4 text-sm font-bold border border-white/5 focus:border-accent focus:shadow-hover outline-none rounded-sm transition-all text-inverse"
                />
              </div>
              <div className="group space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                  Last Name
                </label>
                <input
                  name="lName"
                  type="text"
                  defaultValue={
                    user.displayName && user.displayName.split(" ").length > 1
                      ? user.displayName.split(" ")[1]
                      : ""
                  }
                  className="w-full bg-surface-2 p-4 text-sm font-bold border border-white/5 focus:border-accent focus:shadow-hover outline-none rounded-sm transition-all text-inverse"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                Verified Email
              </label>
              <input
                readOnly
                type="email"
                value={user.email}
                className="w-full bg-surface-3 p-4 text-sm font-bold border border-white/5 text-muted/50 cursor-not-allowed outline-none rounded-sm italic"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="group flex items-center gap-3 bg-accent text-dark px-10 py-4 text-xs font-black uppercase italic tracking-widest hover:shadow-hover rounded-full transition-all disabled:opacity-50 active:scale-95"
              >
                {isUpdating ? "Processing..." : "Sync Blueprint"}
                <IoPulseOutline
                  className={
                    isUpdating ? "animate-spin" : "group-hover:animate-pulse"
                  }
                  size={16}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const PasswordForm = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsUpdating(true);
      const formData = new FormData(e.currentTarget);
      const currentPass = formData.get("currentPass") as string;
      const newPass = formData.get("newPass") as string;
      const confirmPass = formData.get("confirmPass") as string;

      if (newPass !== confirmPass) {
        toast.error("KEYS DO NOT MATCH");
        setIsUpdating(false);
        return;
      }

      try {
        if (auth.currentUser && auth.currentUser.email) {
          const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPass
          );
          await reauthenticateWithCredential(auth.currentUser, credential);
          await updatePassword(auth.currentUser, newPass);
          toast.success("SECURITY KEY RE-INITIALIZED");
          (e.target as HTMLFormElement).reset();
        }
      } catch (err: any) {
        toast.error(
          "PROTOCOL REJECTION: " + err.message.split("/")[1]?.toUpperCase() ||
            "ERROR"
        );
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <div className="h-full pt-12 lg:pt-0 border-t lg:border-t-0 border-white/5 lg:pl-12 animate-fade">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <IoKeyOutline className="text-accent" size={20} />
              </div>
              <h3 className="text-xl font-display font-black uppercase italic tracking-tighter text-inverse">
                Security Keys
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_#97e13e]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-success italic">
                Encrypted
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <input
              name="currentPass"
              type="password"
              placeholder="Current Entry Key"
              required
              className="w-full bg-surface-2 p-4 text-sm font-bold border border-white/5 focus:border-accent outline-none rounded-sm text-inverse placeholder:text-muted/30"
            />
            <div className="grid grid-cols-1 gap-4">
              <input
                name="newPass"
                type="password"
                placeholder="New Security Key"
                required
                className="w-full bg-surface-2 p-4 text-sm font-bold border border-white/5 focus:border-accent outline-none rounded-sm text-inverse placeholder:text-muted/30"
              />
              <input
                name="confirmPass"
                type="password"
                placeholder="Confirm New Key"
                required
                className="w-full bg-surface-2 p-4 text-sm font-bold border border-white/5 focus:border-accent outline-none rounded-sm text-inverse placeholder:text-muted/30"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6">
              <button
                type="button"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-accent underline underline-offset-8 decoration-white/10 hover:decoration-accent transition-all"
              >
                Emergency Reset?
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto bg-inverse text-dark px-10 py-4 text-xs font-black uppercase italic tracking-widest hover:bg-accent rounded-full transition-all disabled:opacity-50 active:scale-95 shadow-custom group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isUpdating ? "Securing..." : "Update Protocol"}
                  <IoFingerPrintOutline
                    className="group-hover:scale-110 transition-transform"
                    size={16}
                  />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:divide-x lg:divide-white/5">
        <ProfileForm />
        <PasswordForm />
      </div>
    </div>
  );
};

export default AccountSettings;
