"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilter,
  setInStock,
  setSelectedBrand,
  setSelectedCategories,
  setSelectedSizes,
  toggleFilter,
} from "@/redux/productsSlice/productsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import PopUpFilterPanel from "@/components/PopUpFilterPanel";

const PopUpFilter = () => {
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

  const toggleSize = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    dispatch(setSelectedSizes(newSizes));
  };

  return (
    <PopUpFilterPanel
      selectedBrands={selectedBrands}
      selectedCategories={selectedCategories}
      selectedSizes={selectedSizes}
      inStock={inStock}
      onBrandToggle={(val) =>
        toggleSelection(selectedBrands, val, setSelectedBrand)
      }
      onCategoryToggle={(val) =>
        toggleSelection(selectedCategories, val, setSelectedCategories)
      }
      onSizeToggle={toggleSize}
      onInStockChange={(val) => dispatch(setInStock(val))}
      onReset={() => dispatch(resetFilter())}
      onClose={() => dispatch(toggleFilter())}
    />
  );
};

export default PopUpFilter;
