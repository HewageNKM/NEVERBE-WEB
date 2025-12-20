"use client";
import { useState, useCallback } from "react";
import { getAlgoliaClient } from "@/utils/bagCalculations";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";

interface UseAlgoliaSearchOptions {
  indexName?: string;
  hitsPerPage?: number;
  minQueryLength?: number;
}

interface UseAlgoliaSearchReturn {
  query: string;
  results: Product[];
  isSearching: boolean;
  showResults: boolean;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

/**
 * Consolidated Algolia search hook
 * Replaces duplicate search logic in Header.tsx and Menu.tsx
 */
export function useAlgoliaSearch(
  options: UseAlgoliaSearchOptions = {}
): UseAlgoliaSearchReturn {
  const {
    indexName = "products_index",
    hitsPerPage = 30,
    minQueryLength = 3,
  } = options;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchClient = getAlgoliaClient();

  const search = useCallback(
    async (searchQuery: string) => {
      setQuery(searchQuery);

      if (searchQuery.trim().length < minQueryLength) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);

      try {
        const searchResults = await searchClient.search({
          requests: [
            {
              indexName,
              query: searchQuery.trim(),
              hitsPerPage,
            },
          ],
        });

        // Filter active, listed, non-deleted products
        const hits = (searchResults.results[0] as any)?.hits || [];
        let filteredResults = hits.filter(
          (item: any) =>
            item.status === true &&
            item.listing === true &&
            item.isDeleted === false
        );

        // Filter out products with all deleted/inactive variants
        filteredResults = filteredResults.filter(
          (item: any) =>
            !item.variants?.every(
              (v: ProductVariant) => v.isDeleted === true || v.status === false
            )
        );

        setResults(filteredResults);
        setShowResults(true);
      } catch (error) {
        console.error("[useAlgoliaSearch] Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [searchClient, indexName, hitsPerPage, minQueryLength]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  }, []);

  return {
    query,
    results,
    isSearching,
    showResults,
    search,
    clearSearch,
  };
}

export default useAlgoliaSearch;
