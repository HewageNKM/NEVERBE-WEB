"use client";
import React, { useState } from "react";
import { Form, Input, Button } from "antd";
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

    const handleUpdate = async (values: any) => {
      setIsUpdating(true);
      const fName = values.fName;
      const lName = values.lName;

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
            <h3 className="text-xl font-display font-black uppercase tracking-tighter text-primary">
              Profile
            </h3>
          </div>

          <Form
            layout="vertical"
            className="space-y-4"
            onFinish={handleUpdate}
            initialValues={{
              fName: user.displayName ? user.displayName.split(" ")[0] : "",
              lName:
                user.displayName && user.displayName.split(" ").length > 1
                  ? user.displayName.split(" ")[1]
                  : "",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="fName"
                label={
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                    First Name
                  </span>
                }
                rules={[{ required: true }]}
                className="mb-0"
              >
                <Input
                  size="large"
                  className="w-full bg-surface-2 p-3 text-sm font-bold border border-default focus:border-primary focus:bg-surface outline-none rounded-xl transition-all"
                />
              </Form.Item>
              <Form.Item
                name="lName"
                label={
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                    Last Name
                  </span>
                }
                rules={[{ required: true }]}
                className="mb-0"
              >
                <Input
                  size="large"
                  className="w-full bg-surface-2 p-3 text-sm font-bold border border-default focus:border-primary focus:bg-surface outline-none rounded-xl transition-all"
                />
              </Form.Item>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Input
                  readOnly
                  type="email"
                  value={user.email}
                  className="w-full bg-surface-3 py-3 px-4 text-sm font-bold border border-default text-muted cursor-not-allowed outline-none rounded-xl"
                />
                <IoCheckmarkCircle
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-accent"
                  size={20}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                className="group flex items-center gap-3 bg-[#2e9e5b] hover:bg-[#26854b] shadow-md hover:shadow-lg text-white px-8 py-5 rounded-full font-black uppercase tracking-widest text-xs border-none transition-all active:scale-[0.98]"
              >
                Save Changes
                {!isUpdating && <IoRefreshOutline size={18} />}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  const PasswordForm = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const [form] = Form.useForm();
    const handleUpdate = async (values: any) => {
      setIsUpdating(true);
      const currentPass = values.currentPass;
      const newPass = values.newPass;
      const confirmPass = values.confirmPass;

      if (newPass !== confirmPass) {
        toast.error("New passwords do not match");
        setIsUpdating(false);
        return;
      }

      try {
        if (auth.currentUser && auth.currentUser.email) {
          const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPass,
          );
          await reauthenticateWithCredential(auth.currentUser, credential);
          await updatePassword(auth.currentUser, newPass);
          toast.success("Password Updated");
          form.resetFields();
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
            <h3 className="text-xl font-display font-black uppercase tracking-tighter text-primary">
              Security
            </h3>
          </div>

          <Form
            form={form}
            layout="vertical"
            className="space-y-4"
            onFinish={handleUpdate}
          >
            <Form.Item
              name="currentPass"
              label={
                <span className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                  Current Password
                </span>
              }
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input.Password
                size="large"
                className="w-full bg-surface p-3 text-sm font-bold border border-default focus:border-primary outline-none rounded-xl transition-all"
              />
            </Form.Item>
            <Form.Item
              name="newPass"
              label={
                <span className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                  New Password
                </span>
              }
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input.Password
                size="large"
                className="w-full bg-surface p-3 text-sm font-bold border border-default focus:border-primary outline-none rounded-xl transition-all"
              />
            </Form.Item>
            <Form.Item
              name="confirmPass"
              label={
                <span className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                  Confirm New Password
                </span>
              }
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input.Password
                size="large"
                className="w-full bg-surface p-3 text-sm font-bold border border-default focus:border-primary outline-none rounded-xl transition-all"
              />
            </Form.Item>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <Button
                type="link"
                className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary underline underline-offset-8 decoration-accent decoration-2 transition-all p-0 h-auto"
              >
                Forgot Password?
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                className="w-full sm:w-auto bg-[#2e9e5b] hover:bg-[#26854b] shadow-md hover:shadow-lg text-white px-8 py-5 rounded-full font-black uppercase tracking-widest text-xs border-none transition-all active:scale-[0.98]"
              >
                Update Password
              </Button>
            </div>
          </Form>
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
