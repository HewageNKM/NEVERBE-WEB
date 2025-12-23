"use client";

import React, { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { useRouter } from "next/navigation";
import { Order } from "@/interfaces/BagItem";
import OrderDetailsModal from "./OrderDetailsModal";
import { toSafeLocaleString } from "@/services/UtilService";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  IoReceiptOutline,
  IoChevronForwardOutline,
  IoPulseOutline,
} from "react-icons/io5";

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
      <div className="space-y-10 animate-fade">
        {/* Header: Technical Log Title */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent italic">
            Operational Log
          </span>
          <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter text-inverse">
            Movement History
          </h2>
        </div>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-white/5 rounded-[2.5rem] flex items-center justify-center">
              <EmptyState
                heading="Log is Empty."
                subHeading="No gear deployments detected in your history."
                actionLabel="Initialize Shopping"
                onAction={() => router.push("/collections/products")}
              />
            </div>
          ) : (
            orders.map((order: any, idx: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col sm:flex-row bg-surface-2 border border-white/5 p-6 md:p-8 gap-6 md:gap-10 hover:border-accent/40 hover:shadow-hover transition-all duration-500 rounded-[2rem] relative overflow-hidden"
              >
                {/* Background Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/[0.02] to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                {/* Thumbnail: Precision Box */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-surface-3 rounded-2xl shrink-0 overflow-hidden border border-default p-2 flex items-center justify-center relative z-10">
                  <Image
                    width={120}
                    height={120}
                    src={
                      order.items?.[0]?.thumbnail ||
                      "https://placehold.co/400?text=GEAR"
                    }
                    alt="Gear"
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Details Area */}
                <div className="flex-1 flex flex-col justify-center relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <h3 className="font-display font-black text-xl md:text-2xl uppercase italic tracking-tighter text-inverse group-hover:text-accent transition-colors">
                        {order.status || "Processing"}
                      </h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted italic bg-dark px-3 py-1 rounded-full border border-white/5">
                      {order.createdAt
                        ? toSafeLocaleString(order.createdAt)
                        : "LOGGED"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                      Deployment ID:{" "}
                      <span className="text-inverse">
                        #{order.orderId || order.id.slice(0, 8)}
                      </span>
                    </p>
                    <p className="text-lg md:text-xl font-display font-black italic text-accent tracking-tighter">
                      LKR {order.total?.toLocaleString() || "0.00"}
                    </p>
                  </div>
                </div>

                {/* Actions: Performance Pill */}
                <div className="flex flex-col gap-3 justify-center relative z-10">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="group/btn flex items-center justify-center gap-3 px-8 py-3 bg-dark text-accent border border-accent/20 text-xs font-black uppercase italic tracking-widest rounded-full hover:bg-accent hover:text-dark hover:shadow-hover transition-all duration-300"
                  >
                    <IoReceiptOutline size={16} />
                    View Spec
                    <IoChevronForwardOutline className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
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
