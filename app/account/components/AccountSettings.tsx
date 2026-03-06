"use client";
import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Typography, Card } from "antd";
const { Title, Text } = Typography;
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
      <Card
        bordered={false}
        className="bg-white rounded-2xl border border-default shadow-none hover:shadow-none transition-all hover:border-accent"
        bodyStyle={{
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl text-accent border border-default">
              <IoPersonOutline size={22} />
            </div>
            <Title
              level={3}
              className="text-xl! font-display! font-black! uppercase! tracking-tighter! text-primary-dark! mb-0!"
            >
              Profile
            </Title>
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
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fName"
                  label={
                    <Text className="block text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                      First Name
                    </Text>
                  }
                  rules={[{ required: true }]}
                  className="mb-0"
                >
                  <Input
                    size="large"
                    className="w-full bg-white p-3 text-sm font-bold border border-default focus:border-accent focus:bg-white outline-none rounded-xl transition-all"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="lName"
                  label={
                    <Text className="block text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                      Last Name
                    </Text>
                  }
                  rules={[{ required: true }]}
                  className="mb-0"
                >
                  <Input
                    size="large"
                    className="w-full bg-white p-3 text-sm font-bold border border-default focus:border-accent focus:bg-white outline-none rounded-xl transition-all"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="space-y-2 mt-4">
              <Text className="block text-[10px] font-black uppercase tracking-widest text-muted ml-1 mb-2">
                Email Address
              </Text>
              <div className="relative">
                <Input
                  readOnly
                  type="email"
                  value={user.email}
                  className="w-full bg-surface-2 py-3 px-4 text-sm font-bold border border-default text-muted cursor-not-allowed outline-none rounded-xl"
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
                className="group flex items-center gap-3 bg-accent hover:bg-accent-hover shadow-md hover:shadow-lg text-white px-6 py-5 rounded-full font-black uppercase tracking-widest text-xs border-none transition-all active:scale-[0.98]"
              >
                Save Changes
                {!isUpdating && <IoRefreshOutline size={18} />}
              </Button>
            </div>
          </Form>
        </div>
      </Card>
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
      <Card
        bordered={false}
        className="bg-white rounded-2xl border border-default shadow-none hover:shadow-none transition-all hover:border-accent h-full"
        bodyStyle={{
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl text-accent border border-default">
              <IoLockClosedOutline size={22} />
            </div>
            <Title
              level={3}
              className="text-xl! font-display! font-black! uppercase! tracking-tighter! text-primary-dark! mb-0!"
            >
              Security
            </Title>
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
                <Text className="block text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                  Current Password
                </Text>
              }
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input.Password
                size="large"
                className="w-full bg-white p-3 text-sm font-bold border border-default focus:border-accent focus:bg-white outline-none rounded-xl transition-all"
              />
            </Form.Item>
            <Form.Item
              name="newPass"
              label={
                <Text className="block text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                  New Password
                </Text>
              }
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input.Password
                size="large"
                className="w-full bg-white p-3 text-sm font-bold border border-default focus:border-accent focus:bg-white outline-none rounded-xl transition-all"
              />
            </Form.Item>
            <Form.Item
              name="confirmPass"
              label={
                <Text className="block text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                  Confirm New Password
                </Text>
              }
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input.Password
                size="large"
                className="w-full bg-white p-3 text-sm font-bold border border-default focus:border-accent focus:bg-white outline-none rounded-xl transition-all"
              />
            </Form.Item>

            <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4 pt-4">
              <Button
                type="link"
                className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary-dark underline underline-offset-8 decoration-accent decoration-2 transition-all p-0 h-auto"
              >
                Forgot Password?
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                className="w-full sm:w-auto bg-accent hover:bg-accent-hover shadow-md hover:shadow-lg text-white px-6 py-5 rounded-full font-black uppercase tracking-widest text-xs border-none transition-all active:scale-[0.98]"
              >
                Update Password
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <ProfileForm />
        </Col>
        <Col xs={24} lg={12}>
          <PasswordForm />
        </Col>
      </Row>
    </div>
  );
};

export default AccountSettings;
