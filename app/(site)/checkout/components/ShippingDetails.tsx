"use client";
import React from "react";
import { Customer } from "@/interfaces";
import { Form, Input, Checkbox, Row, Col, Typography, Flex } from "antd";

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
    <section className="w-full mx-auto md:px-0 px-2 mt-4 md:mt-0">
      <Flex align="center" justify="space-between" className="mb-6">
        <Typography.Title
          level={4}
          className="uppercase tracking-tighter"
          style={{ margin: 0, fontWeight: 900 }}
        >
          Shipping
        </Typography.Title>
      </Flex>

      <Flex align="center" gap={12} className="mb-6">
        <Checkbox
          id="sameAddress"
          checked={shippingSameAsBilling}
          onChange={(e) => setShippingSameAsBilling(!shippingSameAsBilling)}
        >
          <span className="text-sm font-bold uppercase tracking-wide text-secondary font-display">
            Same as billing address
          </span>
        </Checkbox>
      </Flex>

      {!shippingSameAsBilling && (
        <Row gutter={[16, 0]} className="w-full animate-fadeIn">
          <Col xs={24} md={12}>
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
                className="px-4 rounded-xl text-sm font-bold"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
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
                className="px-4 rounded-xl text-sm font-bold"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
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
                className="px-4 rounded-xl text-sm font-bold"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
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
                className="px-4 rounded-xl text-sm font-bold"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
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
                className="px-4 rounded-xl text-sm font-bold"
              />
            </Form.Item>
          </Col>
        </Row>
      )}
    </section>
  );
};

export default ShippingDetails;
