"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import ProductsFilter from "@/app/collections/products/components/ProductsFilter";
import { IoFilter, IoCheckmark } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import {
  setPage,
  setProducts,
  setSelectedSort,
  toggleFilter,
} from "@/redux/productsSlice/productsSlice";
import { sortingOptions } from "@/constants";
import axios from "axios";
import { Product } from "@/interfaces/Product";

const Products = ({ items }: { items: Product[] }) => {
  const dispatch: AppDispatch = useDispatch();
  const {
    products,
    page,
    size,
    selectedBrands,
    selectedCategories,
    inStock,
    selectedSort,
  } = useSelector((state: RootState) => state.productsSlice);

  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(setProducts(items));
  }, [dispatch, items]);

  useEffect(() => {
    fetchProducts();
  }, [dispatch, page, size, selectedBrands, selectedCategories, inStock]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params: Record<string, any> = {
        page,
        size,
      };
      const queryParts: string[] = [];

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParts.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          );
        }
      });

      if (inStock) {
        queryParts.push("inStock=true");
      }

      if (selectedBrands?.length) {
        selectedBrands.forEach((brand: string) => {
          queryParts.push(`tag=${encodeURIComponent(brand)}`);
        });
      }

      if (selectedCategories?.length) {
        selectedCategories.forEach((cat: string) => {
          queryParts.push(`tag=${encodeURIComponent(cat)}`);
        });
      }

      const queryString = queryParts.join("&");

      const response = await axios.get(`/api/v1/products?${queryString}`);
      dispatch(setProducts(response.data.data));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="w-full flex flex-col lg:flex-row gap-6 pt-5 lg:justify-between">
      {/* --- Desktop Filters --- */}
      <aside className="hidden lg:block w-[22%]">
        <ProductsFilter />
      </aside>

      {/* --- Products Section --- */}
      <div className="flex-1 relative">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-20 flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm"
        >
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => dispatch(toggleFilter())}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <FiFilter size={20} />
              <span className="text-sm font-medium text-gray-700">Filter</span>
            </button>
          </div>

          {/* Custom Sorting Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setOpenSort(!openSort)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:bg-gray-50 transition"
            >
              <IoFilter size={20} className="text-gray-500" />
              <span className="text-gray-700 font-medium capitalize"></span>
            </button>

            <AnimatePresence>
              {openSort && (
                <motion.ul
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50"
                >
                  {sortingOptions.map((opt) => {
                    const isSelected = selectedSort === opt.value;
                    return (
                      <li
                        key={opt.value}
                        onClick={() => {
                          dispatch(setSelectedSort(opt.value));
                          setOpenSort(false);
                        }}
                        className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 transition ${
                          isSelected ? "bg-blue-100 font-semibold" : ""
                        }`}
                      >
                        <span>{opt.name}</span>
                        <IoCheckmark
                          className={
                            isSelected ? "text-blue-600" : "text-gray-300"
                          }
                          size={18}
                        />
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* --- Products Grid --- */}
        {isLoading ? (
          <ComponentLoader />
        ) : products.length === 0 ? (
          <EmptyState heading="Products Not Available!" />
        ) : (
          <motion.ul
            key={page} // triggers animation on page change
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.05, duration: 0.4 },
              },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 items-center justify-center content-center"
          >
            {products.map((item) => (
              <motion.li
                key={item.itemId}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="group"
              >
                <ItemCard item={item} />
              </motion.li>
            ))}
          </motion.ul>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mt-10"
        >
          <Pagination
            count={5}
            variant="outlined"
            shape="rounded"
            onChange={(event, value) => dispatch(setPage(value))}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
