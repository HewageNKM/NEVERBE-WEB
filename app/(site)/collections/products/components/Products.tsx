"use client";
import React, { useEffect, useState, useRef } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import ProductsFilter from "@/app/(site)/collections/products/components/ProductsFilter";
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
  const [totalProduct, setTotalProduct] = useState(0);

  useEffect(() => {
    dispatch(setProducts(items));
  }, [dispatch, items]);

  useEffect(() => {
    fetchProducts();
  }, [dispatch, page, size, selectedBrands, selectedCategories, inStock]);

  useEffect(() => {
    sortProducts();
  }, [selectedSort]);

  const sortProducts = () => {
    if (!products || products.length === 0) return [];
    let sortedProducts = [...products];
    setIsLoading(true);
    switch (selectedSort) {
      case "LOW TO HIGH":
        sortedProducts.sort(
          (a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0)
        );
        break;

      case "HIGH TO LOW":
        sortedProducts.sort(
          (a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0)
        );
        break;

      default:
        sortedProducts = [...products];
        break;
    }
    setProducts(sortedProducts);
    setIsLoading(false);
  };

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
      dispatch(setProducts(response.data.dataList));
      setTotalProduct(response.data.total);
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
    <LazyMotion features={domAnimation}>
      <section className="w-full flex flex-col lg:flex-row gap-6 pt-5 lg:justify-between">
        {/* --- Desktop Filters --- */}
        <aside className="hidden lg:block w-[22%]">
          <ProductsFilter />
        </aside>

        {/* --- Products Section --- */}
        <div className="flex-1 relative">
          {/* Toolbar */}
          <m.div
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
                <span className="text-sm font-medium text-gray-700">
                  Filter
                </span>
              </button>
            </div>

            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setOpenSort(!openSort)}
                className="flex items-center gap-2 text-gray-700 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
              >
                <IoFilter />
                <span>Sort by: {selectedSort.toUpperCase()}</span>
              </button>

              <AnimatePresence>
                {openSort && (
                  <m.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-30 overflow-hidden"
                  >
                    {sortingOptions.map((opt, i) => (
                      <m.li
                        key={i}
                        onClick={() => {
                          dispatch(setSelectedSort(opt.value));
                          setOpenSort(false);
                        }}
                        className={`px-4 py-2 text-sm flex items-center justify-between cursor-pointer hover:bg-gray-100 ${
                          selectedSort === opt.value ? "text-primary" : ""
                        }`}
                      >
                        {opt.name}
                        {selectedSort === opt.value && <IoCheckmark />}
                      </m.li>
                    ))}
                  </m.ul>
                )}
              </AnimatePresence>
            </div>
          </m.div>

          {/* --- Products Grid --- */}
          {isLoading ? (
            <ComponentLoader />
          ) : products.length === 0 ? (
            <EmptyState heading="Products Not Available!" />
          ) : (
            <m.ul
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
              {products?.map((item) => (
                <m.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="group"
                >
                  <ItemCard item={item} />
                </m.li>
              ))}
            </m.ul>
          )}

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mt-10"
          >
            <Pagination
              count={Math.ceil(totalProduct / size)}
              page={page}
              variant="outlined"
              shape="rounded"
              onChange={(event, value) => dispatch(setPage(value))}
            />
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
};

export default Products;
