"use client";

import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Typography, Card } from "antd";
const { Title, Text } = Typography;
import toast from "react-hot-toast";
import { auth } from "@/firebase/firebaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMapOutline,
  IoCardOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoPencilOutline,
} from "react-icons/io5";
import axiosInstance from "@/actions/axiosInstance";

interface Address {
  type: "Shipping" | "Billing";
  address: string;
  city: string;
  phone: string;
}

interface SavedAddressesProps {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  user: any;
}

const SavedAddresses: React.FC<SavedAddressesProps> = ({
  addresses,
  setAddresses,
  user,
}) => {
  const AddressCard = ({ type }: { type: "Shipping" | "Billing" }) => {
    const existing = addresses.find((a) => a.type === type);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [form] = Form.useForm();
    const handleSave = async (values: any) => {
      setIsSaving(true);

      const newAddress = {
        type,
        address: values.address,
        city: values.city,
        phone: values.phone,
      };

      try {
        const token = await auth.currentUser?.getIdToken();
        const formData = new FormData();
        formData.append("data", JSON.stringify(newAddress));
        const res = await axiosInstance.post(
          "/web/customers/addresses",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data) {
          const updated = addresses.filter((a) => a.type !== type);
          setAddresses([...updated, newAddress]);
          toast.success(`${type} Address Updated`);
          setIsEditing(false);
        }
      } catch (err) {
        toast.error("Failed to save address");
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="h-full">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-6 rounded-2xl border border-default"
            >
              <Form
                form={form}
                layout="vertical"
                className="space-y-4"
                onFinish={handleSave}
                initialValues={{
                  address: existing?.address,
                  city: existing?.city,
                  phone: existing?.phone,
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <Title
                    level={3}
                    className="text-lg! font-bold! text-primary-dark! uppercase! tracking-tight! mb-0!"
                  >
                    Edit {type} Address
                  </Title>
                  <Button
                    type="text"
                    onClick={() => setIsEditing(false)}
                    className="text-muted hover:text-primary-dark transition-colors p-0 h-auto"
                  >
                    <IoCloseOutline size={24} />
                  </Button>
                </div>

                <Form.Item
                  name="address"
                  rules={[{ required: true, message: "Required" }]}
                  className="mb-0"
                >
                  <Input
                    size="large"
                    placeholder="Street Address"
                    className="w-full bg-white p-3 rounded-xl border border-default focus:border-accent outline-none text-sm transition-all hover:bg-white focus:bg-white"
                  />
                </Form.Item>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="city"
                    rules={[{ required: true, message: "Required" }]}
                    className="mb-0"
                  >
                    <Input
                      size="large"
                      placeholder="City"
                      className="w-full bg-white p-3 rounded-xl border border-default focus:border-accent outline-none text-sm transition-all hover:bg-white focus:bg-white"
                    />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    rules={[{ required: true, message: "Required" }]}
                    className="mb-0"
                  >
                    <Input
                      size="large"
                      placeholder="Phone Number"
                      className="w-full bg-white p-3 rounded-xl border border-default focus:border-accent outline-none text-sm transition-all hover:bg-white focus:bg-white"
                    />
                  </Form.Item>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSaving}
                  className="w-full bg-dark hover:bg-accent text-inverse hover:text-dark py-5 rounded-full font-black uppercase text-[10px] tracking-widest border-none mt-4"
                >
                  Save Address
                </Button>
              </Form>
            </motion.div>
          ) : (
            <motion.div key="display" className="h-full">
              <Card
                bordered={false}
                className="bg-white rounded-2xl border border-default flex flex-col justify-between h-full min-h-[200px] relative group hover:border-accent transition-all shadow-none hover:shadow-none"
                bodyStyle={{
                  padding: "24px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-accent border border-default">
                      {type === "Shipping" ? (
                        <IoMapOutline size={20} />
                      ) : (
                        <IoCardOutline size={20} />
                      )}
                    </div>
                    <Title
                      level={3}
                      className="font-display! font-black! text-lg! uppercase! tracking-tighter! text-primary-dark! mb-0!"
                    >
                      {type} Address
                    </Title>
                  </div>

                  {existing ? (
                    <div className="space-y-1 block">
                      <Text className="block text-sm font-bold text-primary-dark">
                        {existing.address}
                      </Text>
                      <Text className="block text-sm text-muted">
                        {existing.city}
                      </Text>
                      <Text className="block text-xs font-bold text-accent mt-2 tracking-widest">
                        {existing.phone}
                      </Text>
                    </div>
                  ) : (
                    <Text className="block text-sm text-muted">
                      No address provided
                    </Text>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    type="text"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:text-primary-dark transition-all"
                  >
                    <IoPencilOutline size={14} />
                    {existing ? "Change Address" : "Add Address"}
                  </Button>
                </div>

                {existing && (
                  <div className="absolute top-6 right-6 text-accent/50">
                    <IoCheckmarkCircleOutline size={22} />
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-default pb-6">
        <Text className="block text-[10px] font-black uppercase tracking-[0.3em] text-accent">
          Delivery
        </Text>
        <Title
          level={2}
          className="text-3xl! font-display! font-black! uppercase! tracking-tighter! text-primary-dark! mt-2! mb-0!"
        >
          Your Addresses
        </Title>
        <Text className="block text-xs text-muted font-bold uppercase tracking-widest mt-2">
          Manage your delivery and billing locations
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <AddressCard type="Shipping" />
        </Col>
        <Col xs={24} md={12}>
          <AddressCard type="Billing" />
        </Col>
      </Row>
    </div>
  );
};

export default SavedAddresses;
