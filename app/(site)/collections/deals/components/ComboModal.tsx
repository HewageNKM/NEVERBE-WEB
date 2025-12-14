"use client";
import DropShadow from "@/components/DropShadow";
import { ComboProduct, BagItem } from "@/interfaces/BagItem";
import { addMultipleToBag, showBag } from "@/redux/bagSlice/bagSlice";
import { AppDispatch } from "@/redux/store";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";

const ComboModal = ({
  combo,
  onClose,
}: {
  combo: ComboProduct;
  onClose: () => void;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]); // Resolved product details
  const [selections, setSelections] = useState<{
    [key: string]: { size: string; variantId: string };
  }>({});

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const promises = combo.items.map(async (item) => {
          // Fetch product details to get variants/sizes
          // This assumes we have public read access to "products"
          const productRef = doc(db, "products", item.productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            return {
              ...productSnap.data(),
              _comboQty: item.quantity,
              _reqVariant: item.variantId,
            };
          }
          return null;
        });
        const results = await Promise.all(promises);
        setItems(results.filter((i) => i !== null));

        // Initialize selections
        const initialSelections: any = {};
        results.forEach((prod: any) => {
          if (prod) {
            // If variant specified in combo, use it. Else default to first.
            // Simplified logic: Just pick first variant and first size for now or force user.
            const variant = prod.variants[0]; // expand logic later
            if (variant) {
              initialSelections[prod.itemId] = {
                variantId: variant.variantId,
                size: variant.sizes.find((s: any) => s.stock > 0)?.size || "",
              };
            }
          }
        });
        setSelections(initialSelections);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (combo) fetchItems();
  }, [combo]);

  const handleSizeChange = (
    itemId: string,
    variantId: string,
    size: string
  ) => {
    setSelections((prev) => ({
      ...prev,
      [itemId]: { variantId, size },
    }));
  };

  const handleAdd = () => {
    const bagItems: BagItem[] = items.map((prod) => {
      const sel = selections[prod.itemId];
      // Find variant info
      const variant = prod.variants.find(
        (v: any) => v.variantId === sel.variantId
      );
      // Calculate prorated discount? Or just add as normal items?
      // If we add as normal items, the bundle price logic in Cart needs to know they are a bundle.
      // OR we add them with a special discount applied to each to match the bundle price.

      // Strategy: Distribute savings across items proportionally or equally.
      // Combo Price: 12000. Original: 15000. Savings: 3000.
      // Items: 2. Discount per item: 1500.

      const totalOriginal = combo.originalPrice;
      const totalCombo = combo.comboPrice;
      const ratio = totalCombo / totalOriginal; // e.g. 0.8

      const originalItemPrice = prod.sellingPrice;
      const discountedPrice = originalItemPrice * ratio;
      const discountAmount = originalItemPrice - discountedPrice;

      return {
        itemId: prod.itemId,
        variantId: sel.variantId,
        size: sel.size,
        quantity: prod._comboQty,
        price: prod.sellingPrice,
        name: prod.name,
        image: variant?.images[0]?.url || "",
        discount: discountAmount * prod._comboQty, // Apply total discount for this qty
        itemType: "COMBO_ITEM",
        maxQuantity: 5, // limit
      };
    });

    dispatch(addMultipleToBag(bagItems));
    dispatch(showBag());
    onClose();
  };

  const isReady = items.every((i) => {
    const sel = selections[i.itemId];
    return sel && sel.size;
  });

  return (
    <DropShadow containerStyle="flex items-center justify-center z-50 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <IoCloseOutline size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {combo.name}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{combo.description}</p>
          <div className="flex gap-3 items-center mt-2">
            <span className="text-xl font-bold">
              Rs. {combo.comboPrice.toLocaleString()}
            </span>
            <span className="text-gray-400 line-through">
              Rs. {combo.originalPrice.toLocaleString()}
            </span>
            <span className="text-red-600 font-bold text-sm uppercase bg-red-50 px-2 py-1">
              Save Rs. {combo.savings.toLocaleString()}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-400">
            Loading bundle details...
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((prod) => (
              <div
                key={prod.itemId}
                className="flex gap-4 border-b border-gray-100 pb-4"
              >
                <div className="w-20 h-24 bg-gray-100 relative shrink-0">
                  {prod.variants[0]?.images[0]?.url && (
                    <Image
                      src={prod.variants[0].images[0].url}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm uppercase">{prod.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Quantity: {prod._comboQty}
                  </p>

                  {/* Size Selector */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prod.variants[0].sizes.map((s: any) => (
                      <button
                        key={s.size}
                        onClick={() =>
                          handleSizeChange(
                            prod.itemId,
                            prod.variants[0].variantId,
                            s.size
                          )
                        }
                        disabled={s.stock <= 0}
                        className={`px-3 py-1 text-xs border ${
                          selections[prod.itemId]?.size === s.size
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-black"
                        } ${
                          s.stock <= 0
                            ? "opacity-30 line-through cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleAdd}
            disabled={!isReady || loading}
            className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Bundle to Bag
          </button>
        </div>
      </motion.div>
    </DropShadow>
  );
};

export default ComboModal;
