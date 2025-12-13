import React, { useState } from "react";
import {
  updatePassword,
  updateProfile,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "@/firebase/firebaseClient";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice/authSlice";

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
          toast.success("Profile updated successfully!");

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
        toast.error("Error updating profile: " + err.message);
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <div className="h-full">
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-medium uppercase tracking-tight">
            Account Details
          </h3>
          <form className="space-y-6" onSubmit={handleUpdate}>
            <div className="flex flex-wrap justify-between gap-4">
              <div className="space-y-1">
                <input
                  name="fName"
                  type="text"
                  defaultValue={user.name ? user.name.split(" ")[0] : ""}
                  placeholder="First Name"
                  className="w-full p-3 border border-gray-300 focus:border-black focus:ring-0 outline-none rounded-none placeholder-gray-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <input
                  name="lName"
                  type="text"
                  defaultValue={
                    user.name && user.name.split(" ").length > 1
                      ? user.name.split(" ")[1]
                      : ""
                  }
                  placeholder="Last Name"
                  className="w-full p-3 border border-gray-300 focus:border-black focus:ring-0 outline-none rounded-none placeholder-gray-500 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1">
              <input
                readOnly
                type="email"
                value={user.email}
                className="w-full p-3 border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed outline-none rounded-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Details"}
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

      if (!currentPass) {
        toast.error("Please enter your current password");
        setIsUpdating(false);
        return;
      }

      if (newPass !== confirmPass) {
        toast.error("Passwords do not match");
        setIsUpdating(false);
        return;
      }

      if (newPass.length < 6) {
        toast.error("Password must be at least 6 characters");
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
          toast.success("Password updated successfully!");
          (e.target as HTMLFormElement).reset();
        }
      } catch (err: any) {
        if (
          err.code === "auth/invalid-credential" ||
          err.code === "auth/wrong-password"
        ) {
          toast.error("Incorrect current password.");
        } else {
          toast.error("Error updating password: " + err.message);
        }
      } finally {
        setIsUpdating(false);
      }
    };

    const handleForgotPassword = async () => {
      if (!user?.email) return;
      try {
        await sendPasswordResetEmail(auth, user.email);
        toast.success(`Password reset link sent to ${user.email}`);
      } catch (err: any) {
        toast.error("Failed to send reset email: " + err.message);
      }
    };

    return (
      <div className="h-full pt-8 lg:pt-0 border-t lg:border-t-0 border-gray-200 mt-8 lg:mt-0">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-medium uppercase tracking-tight mb-4">
              Security
            </h3>
            <p className="text-sm text-gray-500">
              To ensure this is you, please enter your current password to make
              changes.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <input
              name="currentPass"
              type="password"
              placeholder="Current Password"
              required
              className="w-full p-3 border border-gray-300 focus:border-black focus:ring-0 outline-none rounded-none placeholder-gray-500"
            />
            <input
              name="newPass"
              type="password"
              placeholder="New Password"
              required
              className="w-full p-3 border border-gray-300 focus:border-black focus:ring-0 outline-none rounded-none placeholder-gray-500"
            />
            <input
              name="confirmPass"
              type="password"
              placeholder="Confirm New Password"
              required
              className="w-full p-3 border border-gray-300 focus:border-black focus:ring-0 outline-none rounded-none placeholder-gray-500"
            />
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-gray-500 underline underline-offset-4 hover:text-black"
              >
                Forgot Password?
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        <ProfileForm />
        <PasswordForm />
      </div>
    </div>
  );
};

export default AccountSettings;
