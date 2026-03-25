import React, { useState } from "react";
import { Form, Input, Button, Rate, Modal } from "antd";
import axiosInstance from "@/actions/axiosInstance";
import { auth } from "@/firebase/firebaseClient";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId?: string;
  initialValues?: {
    reviewId: string;
    rating: number;
    review: string;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
  open: boolean;
}

const ReviewForm = ({ productId, initialValues, onSuccess, onCancel, open }: ReviewFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      
      const payload = {
        rating: values.rating,
        review: values.review,
        ...(productId && { itemId: productId }),
      };

      formData.append("data", JSON.stringify(payload));

      if (initialValues) {
        // Edit mode
        await axiosInstance.patch(`/web/reviews/${initialValues.reviewId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Review updated successfully!");
      } else {
        // Create mode
        await axiosInstance.post("/web/reviews", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Review submitted! It will appear once approved.");
      }
      
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      console.error("Failed to submit review", error);
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit Review" : "Write a Review"}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues || { rating: 5, review: "" }}
        className="mt-4"
      >
        <Form.Item
          name="rating"
          label="Your Rating"
          rules={[{ required: true, message: "Please provide a rating" }]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          name="review"
          label="Your Review"
          rules={[{ required: true, message: "Please write your review" }]}
        >
          <Input.TextArea rows={4} placeholder="Describe your experience..." />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={onCancel} className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} className="bg-accent border-none hover:bg-accent-hover!">
            {initialValues ? "Update Review" : "Submit Review"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReviewForm;
