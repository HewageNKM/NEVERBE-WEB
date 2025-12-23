"use client";
import React, { useState } from "react";
import {
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "@/firebase/firebaseClient";
import { setUser } from "@/redux/authSlice/authSlice";
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoCheckmarkCircle,
  IoRefreshOutline,
} from "react-icons/io5";

const AccountSettings = ({ user, dispatch }: { user: any; dispatch: any }) => {
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
          toast.success("Profile Updated Successfully");

          const updatedUser = {
            ...user,
            displayName: auth.currentUser.displayName,
          };
          dispatch(setUser(updatedUser));
        }
      } catch (err: any) {
        toast.error("Error updating profile");
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <div className="bg-surface p-8 rounded-2xl border border-default transition-all hover:border-accent">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-surface-2 rounded-xl text-primary border border-default">
              <IoPersonOutline size={22} />
            </div>
            <h3 className="text-xl font-display font-black uppercase italic tracking-tighter text-primary">
              Profile
            </h3>
          </div>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                  First Name
                </label>
                <input
                  name="fName"
                  type="text"
                  defaultValue={
                    user.displayName ? user.displayName.split(" ")[0] : ""
                  }
                  className="w-full bg-surface-2 p-4 text-sm font-bold border border-default focus:border-primary focus:bg-surface outline-none rounded-xl transition-all"
                />
              </div>
              <div className="space-y-2">
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
                  className="w-full bg-surface-2 p-4 text-sm font-bold border border-default focus:border-primary focus:bg-surface outline-none rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  readOnly
                  type="email"
                  value={user.email}
                  className="w-full bg-surface-3 p-4 text-sm font-bold border border-default text-muted cursor-not-allowed outline-none rounded-xl"
                />
                <IoCheckmarkCircle
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-accent"
                  size={20}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="group flex items-center gap-3 bg-dark text-inverse px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-dark rounded-full transition-all disabled:opacity-50 active:scale-95"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
                <IoRefreshOutline
                  className={isUpdating ? "animate-spin" : ""}
                  size={18}
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
        toast.error("New passwords do not match");
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
          toast.success("Password Updated");
          (e.target as HTMLFormElement).reset();
        }
      } catch (err: any) {
        toast.error("Verification failed. Check current password.");
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <div className="bg-surface-2 p-8 rounded-2xl border border-default transition-all hover:border-accent h-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-surface rounded-xl text-primary border border-default">
              <IoLockClosedOutline size={22} />
            </div>
            <h3 className="text-xl font-display font-black uppercase italic tracking-tighter text-primary">
              Security
            </h3>
          </div>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                Current Password
              </label>
              <input
                name="currentPass"
                type="password"
                required
                className="w-full bg-surface p-4 text-sm font-bold border border-default focus:border-primary outline-none rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                New Password
              </label>
              <input
                name="newPass"
                type="password"
                required
                className="w-full bg-surface p-4 text-sm font-bold border border-default focus:border-primary outline-none rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                Confirm New Password
              </label>
              <input
                name="confirmPass"
                type="password"
                required
                className="w-full bg-surface p-4 text-sm font-bold border border-default focus:border-primary outline-none rounded-xl transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <button
                type="button"
                className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary underline underline-offset-8 decoration-accent decoration-2 transition-all"
              >
                Forgot Password?
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto bg-dark text-inverse px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-dark rounded-full transition-all disabled:opacity-50 active:scale-95"
              >
                {isUpdating ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileForm />
        <PasswordForm />
      </div>
    </div>
  );
};

export default AccountSettings;
