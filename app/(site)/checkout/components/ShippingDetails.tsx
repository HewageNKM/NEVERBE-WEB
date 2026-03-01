"use client";
import React from "react";
import { Customer } from "@/interfaces";
import { Form, Input, Checkbox } from "antd";

const ShippingDetails = ({
  shippingSameAsBilling,
  setShippingSameAsBilling,
  shippingCustomer,
  setShippingCustomer,
}: {
  shippingSameAsBilling: boolean;
  setShippingSameAsBilling: React.Dispatch<React.SetStateAction<boolean>>;
  shippingCustomer: Partial<Customer> | null;
  setShippingCustomer: React.Dispatch<
    React.SetStateAction<Partial<Customer> | null>
  >;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingCustomer((prev) => ({
      ...(prev as Customer),
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-black uppercase italic tracking-tighter text-primary">
          Shipping
        </h2>
      </div>

      <div className="flex items-center gap-3 mb-6 p-4 bg-surface-2 border border-default rounded-xl">
        <Checkbox
          id="sameAddress"
          checked={shippingSameAsBilling}
          onChange={(e) => setShippingSameAsBilling(!shippingSameAsBilling)}
        >
          <span className="text-sm font-bold uppercase tracking-wide text-secondary">
            Same as billing address
          </span>
        </Checkbox>
      </div>

      {!shippingSameAsBilling && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0 w-full animate-fadeIn">
          <div>
            <Form.Item
              name="shippingName"
              label={
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Recipient Name *
                </span>
              }
              rules={[
                { required: true, message: "Please input recipient name!" },
              ]}
            >
              <Input
                size="large"
                onChange={handleChange}
                className="px-4 bg-surface-2 border-default rounded-xl hover:border-accent focus:border-accent text-sm font-bold text-primary"
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name="shippingPhone"
              label={
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Phone *
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input shipping phone number!",
                },
              ]}
            >
              <Input
                size="large"
                onChange={handleChange}
                className="px-4 bg-surface-2 border-default rounded-xl hover:border-accent focus:border-accent text-sm font-bold text-primary"
              />
            </Form.Item>
          </div>

          <div className="md:col-span-2">
            <Form.Item
              name="shippingAddress"
              label={
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Address *
                </span>
              }
              rules={[
                { required: true, message: "Please input shipping address!" },
              ]}
            >
              <Input
                size="large"
                onChange={handleChange}
                className="px-4 bg-surface-2 border-default rounded-xl hover:border-accent focus:border-accent text-sm font-bold text-primary"
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name="shippingCity"
              label={
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                  City *
                </span>
              }
              rules={[
                { required: true, message: "Please input shipping city!" },
              ]}
            >
              <Input
                size="large"
                onChange={handleChange}
                className="px-4 bg-surface-2 border-default rounded-xl hover:border-accent focus:border-accent text-sm font-bold text-primary"
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name="shippingZip"
              label={
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                  Postal Code
                </span>
              }
            >
              <Input
                size="large"
                onChange={handleChange}
                className="px-4 bg-surface-2 border-default rounded-xl hover:border-accent focus:border-accent text-sm font-bold text-primary"
              />
            </Form.Item>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShippingDetails;
