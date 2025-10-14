"use client";
import React, { useEffect, useRef, useState } from "react";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import ManufacturerFilter from "@/app/collections/[manufacturer]/components/ManufacturerFilter";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { IoFilter, IoCheckmark } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import {
  getItemsByManufacturer,
  setProducts,
  setPage,
  setSelectedSort,
  toggleFilter,
} from "@/redux/manufacturerSlice/manufacturerSlice";
import { sortingOptions } from "@/constants";

const ManufacturerProducts = ({
  items,
  manufacturer,
}: {
  items: any[];
  manufacturer: string;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { products, page, size, selectedSort, isLoading, error } = useSelector(
    (state: RootState) => state.manufacturerSlice
  );
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Initialize localStorage & set products
  useEffect(() => {
    window.localStorage.setItem("manufacturer", manufacturer);
    dispatch(setProducts(items));
  }, [dispatch, items, manufacturer]);

  // Fetch products when page, sort, or size changes
  useEffect(() => {
    dispatch(getItemsByManufacturer({ name: manufacturer, page, size }));
  }, [dispatch, page, size, selectedSort, manufacturer]);

  // Close sorting dropdown when clicking outside
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
    <section className="w-full flex flex-col lg:flex-row gap-10 pt-5 lg:justify-between">
      {/* Desktop Filters */}
      <aside className="hidden lg:block w-[22%]">
        <ManufacturerFilter manufacturer={manufacturer} />
      </aside>

      {/* Products Section */}
      <div className="flex-1 relative">
        {/* Toolbar */}
        <div className="sticky top-0 z-20 flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
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

          {/* Sorting Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setOpenSort(!openSort)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:bg-gray-50 transition"
            >
              <IoFilter size={20} className="text-gray-500" />
              <span className="text-gray-700 font-medium capitalize">{selectedSort}</span>
            </button>

            {openSort && (
              <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50">
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
                        className={isSelected ? "text-blue-600" : "text-gray-300"}
                        size={18}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ComponentLoader />
        ) : products.length === 0 ? (
          <EmptyState heading="Products Not Available!" />
        ) : error ? (
          <EmptyState heading="An error occurred!" subHeading={error} />
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <li key={item.itemId} className="group">
                <ItemCard item={item} />
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex justify-center mt-10">
            <Pagination
              count={5} // You can calculate total pages dynamically
              variant="outlined"
              shape="rounded"
              onChange={(event, value) => dispatch(setPage(value))}
              className="shadow-lg rounded-md"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ManufacturerProducts;
