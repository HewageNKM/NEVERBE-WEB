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
        {/* Header: Clean Retail Title */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#97e13e]">
            Member Purchases
          </span>
          <h2 className="text-3xl font-display font-black uppercase tracking-tighter text-black">
            Order History
          </h2>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-20 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex items-center justify-center text-center px-6">
              <EmptyState
                heading="No orders yet"
                subHeading="Your purchase history will appear here once you've made your first gear deployment."
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
                className="group flex flex-col md:flex-row bg-white border border-zinc-100 p-5 md:p-6 gap-6 items-center hover:border-black hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500 rounded-[2rem] relative"
              >
                {/* Thumbnail: Clean Product Box */}
                <div className="w-24 h-24 md:w-28 md:h-28 bg-zinc-50 rounded-2xl shrink-0 overflow-hidden border border-zinc-100 p-2 flex items-center justify-center">
                  <Image
                    width={100}
                    height={100}
                    src={
                      order.items?.[0]?.thumbnail ||
                      "https://placehold.co/400?text=GEAR"
                    }
                    alt="Product Gear"
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Details Area */}
                <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#97e13e] shadow-[0_0_8px_#97e13e]" />
                      <h3 className="font-display font-black text-xl uppercase tracking-tighter text-black">
                        {order.status || "Processing"}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {order.createdAt
                        ? toSafeLocaleString(order.createdAt)
                        : "JUST NOW"}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                        Order No:{" "}
                        <span className="text-black">
                          #{order.orderId || order.id.slice(0, 8)}
                        </span>
                      </p>
                      <p className="text-2xl font-display font-black text-black tracking-tighter">
                        LKR {order.total?.toLocaleString() || "0.00"}
                      </p>
                    </div>

                    {/* Action Button: Clean Pill */}
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-[#97e13e] hover:text-black transition-all duration-300 shadow-lg shadow-black/5"
                    >
                      <IoReceiptOutline size={16} />
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
