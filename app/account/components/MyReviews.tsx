import React, { useEffect, useState } from "react";
import { Table, Button, Rate, Tag, Space, Modal, Typography, Empty } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axiosInstance from "@/actions/axiosInstance";
import { auth } from "@/firebase/firebaseClient";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import ReviewForm from "@/components/ReviewForm";

const { Text, Title } = Typography;
const { confirm } = Modal;

interface Review {
  reviewId: string;
  itemId: string;
  rating: number;
  review: string;
  status: string;
  createdAt: string;
}

const MyReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await axiosInstance.get("/web/customers/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = (reviewId: string) => {
    confirm({
      title: "Are you sure you want to delete this review?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const token = await auth.currentUser?.getIdToken();
          await axiosInstance.delete(`/web/reviews/${reviewId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Review deleted successfully");
          fetchReviews();
        } catch (error) {
          console.error("Failed to delete review", error);
          toast.error("Failed to delete review");
        }
      },
    });
  };

  const columns = [
    {
      title: "Review",
      key: "review",
      render: (record: Review) => (
        <Space direction="vertical" size={4}>
          <Rate disabled defaultValue={record.rating} style={{ fontSize: 12 }} />
          <Text className="block text-sm font-medium">{record.review}</Text>
          <Text className="text-[10px] text-muted uppercase tracking-widest">
            {record.createdAt ? formatDistanceToNow(new Date(record.createdAt), { addSuffix: true }) : "recently"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={status === "APPROVED" ? "success" : status === "PENDING" ? "processing" : "error"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (record: Review) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined className="text-accent" />}
            onClick={() => {
              setEditingReview(record);
              setIsModalOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined className="text-error" />}
            onClick={() => handleDelete(record.reviewId)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade">
      <div className="mb-8">
        <Title level={4} className="uppercase tracking-tighter font-black m-0">
          My Reviews
        </Title>
        <Text className="text-muted text-xs">Manage your feedback for products you've purchased.</Text>
      </div>

      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="reviewId"
        loading={loading}
        pagination={{ hideOnSinglePage: true }}
        locale={{
          emptyText: (
            <Empty
              description="No reviews yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="py-12"
            >
              <Button type="primary" onClick={() => (window.location.href = "/collections/products")} className="bg-accent border-none rounded-full px-8 h-10 font-black uppercase text-[10px] tracking-widest mt-4">
                Shop to Review
              </Button>
            </Empty>
          ),
        }}
        className="review-table rounded-2xl overflow-hidden border border-default shadow-sm"
      />

      <ReviewForm
        open={isModalOpen}
        initialValues={editingReview}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingReview(null);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingReview(null);
          fetchReviews();
        }}
      />
    </div>
  );
};

export default MyReviews;
