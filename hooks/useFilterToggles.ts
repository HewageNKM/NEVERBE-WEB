import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

/**
 * Generic toggle function for filter selections
 * Consolidates duplicate toggle logic from DealsFilter, ProductsFilter, PopUpFilter, CollectionFilter
 */
export function createToggleHandler<T>(
  currentList: string[],
  dispatchAction: (newList: string[]) => { type: string; payload: string[] },
  dispatch: AppDispatch,
  options: { maxItems?: number; toLowerCase?: boolean } = {}
) {
  const { maxItems = 5, toLowerCase = true } = options;

  return (value: string) => {
    const normalizedValue = toLowerCase ? value.toLowerCase() : value;
    const newList = currentList.includes(normalizedValue)
      ? currentList.filter((item) => item !== normalizedValue)
      : [...currentList, normalizedValue];

    // Limit max items if specified
    const limitedList = maxItems > 0 ? newList.slice(0, maxItems) : newList;
    dispatch(dispatchAction(limitedList));
  };
}

/**
 * Size toggle handler (no lowercase transformation, no limit)
 */
export function createSizeToggleHandler(
  currentSizes: string[],
  dispatchAction: (sizes: string[]) => { type: string; payload: string[] },
  dispatch: AppDispatch
) {
  return (size: string) => {
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    dispatch(dispatchAction(newSizes));
  };
}

/**
 * Hook for filter toggle handlers
 * Returns reusable toggle functions for brands, categories, and sizes
 */
export function useFilterToggles(
  selectedBrands: string[],
  selectedCategories: string[],
  selectedSizes: string[],
  brandAction: (list: string[]) => any,
  categoryAction: (list: string[]) => any,
  sizeAction: (list: string[]) => any
) {
  const dispatch: AppDispatch = useDispatch();

  const toggleBrand = useCallback(
    (value: string) => {
      const lowerValue = value.toLowerCase();
      const newBrands = selectedBrands.includes(lowerValue)
        ? selectedBrands.filter((b) => b !== lowerValue)
        : [...selectedBrands, lowerValue];
      dispatch(brandAction(newBrands.slice(0, 5)));
    },
    [dispatch, selectedBrands, brandAction]
  );

  const toggleCategory = useCallback(
    (value: string) => {
      const lowerValue = value.toLowerCase();
      const newCats = selectedCategories.includes(lowerValue)
        ? selectedCategories.filter((c) => c !== lowerValue)
        : [...selectedCategories, lowerValue];
      dispatch(categoryAction(newCats.slice(0, 5)));
    },
    [dispatch, selectedCategories, categoryAction]
  );

  const toggleSize = useCallback(
    (size: string) => {
      const newSizes = selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size];
      dispatch(sizeAction(newSizes));
    },
    [dispatch, selectedSizes, sizeAction]
  );

  return { toggleBrand, toggleCategory, toggleSize };
}
