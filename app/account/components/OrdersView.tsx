import React from "react";
import EmptyState from "@/components/EmptyState"; // Verify path

interface OrdersViewProps {
  orders: any[];
}

const OrdersView: React.FC<OrdersViewProps> = ({ orders }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-medium uppercase tracking-tight">
        Order History
      </h2>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <EmptyState
            heading="No orders found."
            subHeading="You have not made any orders yet."
            actionLabel="Start Shopping"
            onAction={() => router.push("/collections/products")}
          />
        ) : (
          orders.map((order: any) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row border border-gray-200 p-6 gap-6 hover:border-black transition-colors"
            >
              <div className="w-24 h-24 bg-gray-100 shrink-0">
                <img
                  src={
                    order.items?.[0]?.thumbnail ||
                    "https://placehold.co/400?text=No+Image"
                  }
                  alt="Product"
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg capitalize">
                    {order.status || "Processing"}
                  </h3>
                  <span className="text-gray-500 text-sm">
                    {order.createdAt
                      ? new Date(order.createdAt).toDateString()
                      : "Recent"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  Order #{order.orderId || order.id.slice(0, 8)}
                </p>
                <p className="font-medium mt-2">
                  LKR {order.total?.toLocaleString() || "0.00"}
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <button className="px-6 py-2 border border-gray-300 text-sm hover:border-black transition-colors">
                  View Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersView;
