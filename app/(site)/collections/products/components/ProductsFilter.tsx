"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilter,
  setSelectedBrand,
  setSelectedCategories,
  setSelectedSizes,
  setInStock,
} from "@/redux/productsSlice/productsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import FilterPanel from "@/components/FilterPanel";

const ProductsFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const { selectedBrands, selectedCategories, selectedSizes, inStock } =
    useSelector((state: RootState) => state.productsSlice);

  const toggleSelection = (list: string[], item: string, action: any) => {
    const lower = item.toLowerCase();
    const newList = list.includes(lower)
      ? list.filter((i) => i !== lower)
      : [...list, lower];
    dispatch(action(newList.slice(0, 5)));
  };

  return (
    <aside className="w-full">
      <FilterPanel
        selectedBrands={selectedBrands}
        selectedCategories={selectedCategories}
        selectedSizes={selectedSizes}
        inStock={inStock}
        onBrandToggle={(v) =>
          toggleSelection(selectedBrands, v, setSelectedBrand)
        }
        onCategoryToggle={(v) =>
          toggleSelection(selectedCategories, v, setSelectedCategories)
        }
        onSizeToggle={(size) => {
          const newSizes = selectedSizes.includes(size)
            ? selectedSizes.filter((s) => s !== size)
            : [...selectedSizes, size];
          dispatch(setSelectedSizes(newSizes));
        }}
        onInStockChange={(val) => dispatch(setInStock(val))}
        onReset={() => dispatch(resetFilter())}
      />
    </aside>
  );
};

export default ProductsFilter;
