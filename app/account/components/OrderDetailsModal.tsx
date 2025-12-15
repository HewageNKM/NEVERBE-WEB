import React from "react";
import { Order } from "@/interfaces/BagItem";
import { X, Download, Package, MapPin, CreditCard } from "lucide-react";
import { toSafeLocaleString } from "@/services/UtilService";
import Image from "next/image";
import Invoice from "@/components/Invoice";
import Link from "next/link";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadInvoice: (order: Order) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onDownloadInvoice,
}) => {
  if (!isOpen || !order) return null;

  const {
    orderId,
    createdAt,
    status,
    items,
    customer,
    paymentMethod,
    shippingFee,
    fee,
    discount,
  } = order;

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemsDiscount = items.reduce(
    (sum, item) => sum + (item.discount || 0),
    0
  );
  const totalDiscount = itemsDiscount + (discount || 0);
  const total = subtotal - totalDiscount + (shippingFee || 0) + (fee || 0);

  // Safe date rendering

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm shadow-xl animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Order Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              #{orderId} • {toSafeLocaleString(createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Status & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black text-white rounded-full">
                <Package size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold capitalize">{status}</p>
                  <Link
                    href={`/checkout/success/${orderId}`}
                    className="text-xs underline text-black hover:text-black"
                  >
                    View Confirmation
                  </Link>
                </div>
              </div>
            </div>
            <Invoice
              order={order}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-sm font-medium rounded-sm shadow-sm"
              btnText={
                <>
                  <Download size={16} />
                  Download Invoice
                </>
              }
            />
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2 mb-4">
              Items ({items.length})
            </h3>
            <div className="space-y-4">
              {(() => {
                // Group items: combo items by comboId, regular items separate
                const comboGroups = new Map<string, typeof items>();
                const regularItems: typeof items = [];

                items.forEach((item) => {
                  if (item.isComboItem && item.comboId) {
                    if (!comboGroups.has(item.comboId)) {
                      comboGroups.set(item.comboId, []);
                    }
                    comboGroups.get(item.comboId)!.push(item);
                  } else {
                    regularItems.push(item);
                  }
                });

                return (
                  <>
                    {/* Regular Items */}
                    {regularItems.map((item, idx) => (
                      <div key={`regular-${idx}`} className="flex gap-4 py-2">
                        <div className="w-20 h-20 bg-gray-100 shrink-0 rounded-sm overflow-hidden">
                          <Image
                            width={80}
                            height={80}
                            src={
                              item.thumbnail ||
                              "https://placehold.co/100?text=Product"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 line-clamp-2">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Size: {item.size}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">
                              Rs. {item.price.toLocaleString()}
                            </p>
                          </div>
                          {item.discount ? (
                            <p className="text-right text-xs text-red-600 mt-1">
                              - Rs. {item.discount.toLocaleString()}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {/* Combo Groups */}
                    {Array.from(comboGroups.entries()).map(
                      ([comboId, comboItems]) => {
                        const comboName =
                          comboItems[0]?.comboName || "Combo Bundle";
                        const comboDiscount = comboItems.reduce(
                          (sum, i) => sum + (i.discount || 0),
                          0
                        );

                        return (
                          <div
                            key={comboId}
                            className="border border-gray-200 rounded-sm overflow-hidden"
                          >
                            {/* Combo Header */}
                            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-sm uppercase">
                                  Combo
                                </span>
                                <h4 className="font-bold text-gray-900">
                                  {comboName}
                                </h4>
                              </div>
                              {comboDiscount > 0 && (
                                <span className="text-red-600 text-sm font-medium">
                                  - Rs. {comboDiscount.toLocaleString()} saved
                                </span>
                              )}
                            </div>

                            {/* Combo Items */}
                            <div className="divide-y divide-gray-100">
                              {comboItems.map((item, idx) => (
                                <div
                                  key={`combo-${comboId}-${idx}`}
                                  className="flex gap-4 p-4"
                                >
                                  <div className="w-16 h-16 bg-gray-100 shrink-0 rounded-sm overflow-hidden">
                                    <Image
                                      width={64}
                                      height={64}
                                      src={
                                        item.thumbnail ||
                                        "https://placehold.co/100?text=Product"
                                      }
                                      alt={item.name}
                                      className="w-full h-full object-cover mix-blend-multiply"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium text-gray-900 text-sm">
                                          {item.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Size: {item.size} • Qty:{" "}
                                          {item.quantity}
                                        </p>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        Rs. {item.price.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Addresses */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-gray-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Billing Address
                  </h3>
                </div>
                <address className="not-italic text-sm text-gray-600 leading-relaxed pl-7 border-l-2 border-gray-100">
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p>{customer.address}</p>
                  <p>
                    {customer.city} {customer.zip && `, ${customer.zip}`}
                  </p>
                  <p>{customer.phone}</p>
                </address>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-gray-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Shipping Address
                  </h3>
                </div>
                <address className="not-italic text-sm text-gray-600 leading-relaxed pl-7 border-l-2 border-gray-100">
                  <p className="font-medium text-gray-900">
                    {customer.shippingName || customer.name}
                  </p>
                  <p>{customer.shippingAddress || customer.address}</p>
                  <p>
                    {customer.shippingCity || customer.city}{" "}
                    {customer.shippingZip ||
                      (customer.zip &&
                        `, ${customer.shippingZip || customer.zip}`)}
                  </p>
                  <p>{customer.shippingPhone || customer.phone}</p>
                </address>
              </div>
            </div>

            {/* Payment & Summary */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={18} className="text-gray-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Payment Info
                  </h3>
                </div>
                <div className="pl-7">
                  <p className="text-sm text-gray-600 capitalize">
                    {paymentMethod}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-sm space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>- Rs. {totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Rs. {(shippingFee || 0).toLocaleString()}</span>
                </div>
                {fee ? (
                  <div className="flex justify-between text-gray-600">
                    <span>Handling Fee</span>
                    <span>Rs. {fee.toLocaleString()}</span>
                  </div>
                ) : null}

                <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
