"use client";
import React, { useEffect, useState } from 'react';
import { Order } from "@/interfaces";
import { getOrdersByUserId } from "@/actions/orderAction";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { notFound } from "next/navigation";

const Orders = () => {
    const { user } = useSelector((state: RootState) => state.authSlice);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            notFound();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const fetchedOrders = await getOrdersByUserId(user?.uid || "");
            setOrders(fetchedOrders);
        } catch (e) {
            console.error("Failed to fetch orders:", e);
        } finally {
            setLoading(false);
        }
    };

    const calculateOrderTotal = (order: Order) => {
        const itemsTotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
        return itemsTotal + (order?.shippingFee || 0) + (order?.fee || 0) - (order.discount || 0);
    };

    return (
        <>
            {loading ? (
                <div className="w-full min-h-32 inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-30">
                    <div className="w-12 h-12 border-4 border-t-4 border-gray-300 border-t-primary-100 rounded-full animate-spin"></div>
                </div>
            ) : orders.length === 0 ? (
                <p className="text-gray-500 text-center">No orders found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                        <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3 text-left">Order ID</th>
                            <th className="p-3 text-left">Payment Status</th>
                            <th className="p-3 text-left">Payment Method</th>
                            <th className="p-3 text-left">Total</th>
                            <th className="p-3 text-left">Tracking Status</th>
                            <th className="p-3 text-left">Last Updated</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order, index) => (
                            <tr
                                key={order.orderId}
                                className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition cursor-pointer`}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <td className="p-3 text-blue-600 font-medium">{order.orderId}</td>
                                <td className="p-3 text-gray-700">{order.paymentStatus}</td>
                                <td className="p-3 text-gray-700">{order.paymentMethod}</td>
                                <td className="p-3 text-gray-700">LKR {calculateOrderTotal(order)}</td>
                                <td className="p-3 text-gray-700">
                                    {order.tracking ? order.tracking.status : "Processing"}
                                </td>
                                <td className="p-3 text-gray-500 text-sm">
                                    {order.tracking ? order.tracking.updatedAt : order.createdAt}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                        <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
                        <p className="text-gray-700">
                            <strong>Customer Name:</strong> {selectedOrder.customer.name}
                        </p>
                        <p className="text-gray-700">
                            <strong>Address:</strong> {selectedOrder.customer.address}
                        </p>
                        <p className="text-gray-700">
                            <strong>Email:</strong> {selectedOrder.customer.email}
                        </p>
                        <p className="text-gray-700">
                            <strong>Phone:</strong> {selectedOrder.customer.phone}
                        </p>
                        <p className="text-gray-700">
                            <strong>Zip:</strong> {selectedOrder.customer.zip || "N/A"}
                        </p>
                        <h3 className="text-lg font-semibold mt-4">Ordered Items</h3>
                        <ul className="border rounded-lg p-3 bg-gray-50">
                            {selectedOrder.items.map((item, index) => (
                                <li key={index} className="text-gray-700">
                                    {item.name}/{item.variantName.toUpperCase()}/{item.size.toUpperCase()} -
                                    LKR {item.price} x {item.quantity}
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-lg font-semibold mt-4">Tracking Information</h3>
                        {selectedOrder.tracking ? (
                            <div className="border rounded-lg p-3 bg-gray-50">
                                <p className="text-gray-700">
                                    <strong>Tracking Number:</strong> {selectedOrder.tracking.trackingNumber}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Company:</strong> {selectedOrder.tracking.trackingCompany}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Status:</strong> {selectedOrder.tracking.status}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Tracking URL:</strong> <a href={selectedOrder.tracking.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Track Here</a>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Last Updated:</strong> {selectedOrder.tracking.updatedAt}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-700 text-center mt-2 font-bold">Processing.......</p>
                        )}

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Orders;