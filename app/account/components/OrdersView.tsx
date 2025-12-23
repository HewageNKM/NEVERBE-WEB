"use client";

import React, { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { useRouter } from "next/navigation";
import { Order } from "@/interfaces/BagItem";
import OrderDetailsModal from "./OrderDetailsModal";
import { toSafeLocaleString } from "@/services/UtilService";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoReceiptOutline, IoChevronForwardOutline } from "react-icons/io5";

interface OrdersViewProps {
  orders: any[];
}

const OrdersView: React.FC<OrdersViewProps> = ({ orders }) => {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDownloadInvoice = (order: Order) => {
    router.push(`/checkout/success/${order.orderId}`);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1 border-b border-default pb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
            Purchases
          </span>
          <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter text-primary">
            Order History
          </h2>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-20 bg-surface-2 rounded-2xl border border-default flex items-center justify-center text-center px-6">
              <EmptyState
                heading="No orders yet"
                subHeading="Your purchase history will appear here once you've made your first order."
                actionLabel="Start Shopping"
                onAction={() => router.push("/collections/products")}
              />
            </div>
          ) : (
            orders.map((order: any, idx: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col md:flex-row bg-surface border border-default p-5 md:p-6 gap-6 items-center hover:border-accent transition-all duration-300 rounded-xl relative"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-surface-2 rounded-xl shrink-0 overflow-hidden border border-default p-2 flex items-center justify-center">
                  <Image
                    width={80}
                    height={80}
                    src={
                      order.items?.[0]?.thumbnail ||
                      "https://placehold.co/400?text=GEAR"
                    }
                    alt="Product"
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <h3 className="font-display font-black text-lg uppercase tracking-tighter text-primary">
                        {order.status || "Processing"}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                      {order.createdAt
                        ? toSafeLocaleString(order.createdAt)
                        : "Just now"}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-muted text-[10px] font-black uppercase tracking-widest">
                        Order No:{" "}
                        <span className="text-primary">
                          #{order.orderId || order.id.slice(0, 8)}
                        </span>
                      </p>
                      <p className="text-xl font-display font-black text-primary tracking-tighter">
                        LKR {order.total?.toLocaleString() || "0.00"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleViewOrder(order)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-dark text-inverse text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-accent hover:text-dark transition-all"
                    >
                      <IoReceiptOutline size={14} />
                      Details
                      <IoChevronForwardOutline className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownloadInvoice={handleDownloadInvoice}
      />
    </>
  );
};

export default OrdersView;
