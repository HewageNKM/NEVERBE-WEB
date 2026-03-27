import { useState, useCallback, useMemo, useEffect } from "react";
import { getAlgoliaClient } from "@/utils/bagCalculations";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import axiosInstance from "@/actions/axiosInstance";

interface UseAlgoliaSearchOptions {
  indexName?: string;
  hitsPerPage?: number;
  minQueryLength?: number;
  debounceMs?: number;
  isDynamic?: boolean; // New option
}

interface UseAlgoliaSearchReturn {
  query: string;
  results: Product[];
  isSearching: boolean;
  showResults: boolean;
  recommendations: Product[];
  search: (query: string) => void;
  executeSearch: (query: string) => Promise<void>; // New function
  fetchRecommendations: () => Promise<void>;
  clearSearch: () => void;
}

/**
 * Consolidated Algolia search hook
 * Replaces duplicate search logic in Header.tsx and Menu.tsx
 */
export function useAlgoliaSearch(
  options: UseAlgoliaSearchOptions = {},
): UseAlgoliaSearchReturn {
  const {
    indexName = "products_index",
    hitsPerPage = 30,
    minQueryLength = 3,
    debounceMs = 500,
    isDynamic = false, // Default to FALSE to remove keystroke dynamic search
  } = options;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const searchClient = useMemo(() => getAlgoliaClient(), []);
  
  // Frontend Results Cache
  const resultsCache = useMemo(() => new Map<string, Product[]>(), []);

  // 1. Manual search function
  const executeSearch = useCallback(async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < minQueryLength) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Check frontend cache first
    const cacheKey = `${indexName}:${trimmedQuery}:${hitsPerPage}`;
    if (resultsCache.has(cacheKey)) {
      setResults(resultsCache.get(cacheKey)!);
      setShowResults(true);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchClient.search({
        requests: [
          {
            indexName,
            query: trimmedQuery,
            hitsPerPage,
          },
        ],
      });

      const hits = (searchResults.results[0] as any)?.hits || [];
      const filteredResults = hits.filter(
        (item: any) =>
          item.status === true &&
          item.listing === true &&
          item.isDeleted === false &&
          !item.variants?.every(
            (v: ProductVariant) => v.isDeleted === true || v.status === false,
          ),
      );

      setResults(filteredResults);
      setShowResults(true);
      
      // Store in frontend cache
      resultsCache.set(cacheKey, filteredResults);
    } catch (error) {
      console.error("[useAlgoliaSearch] Search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [indexName, hitsPerPage, minQueryLength, searchClient, resultsCache]);

  // 2. Debounce Effect: Updates debouncedQuery after user stops typing
  useEffect(() => {
    if (query.trim().length === 0) {
      setDebouncedQuery("");
      setResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    if (!isDynamic) return; // Skip dynamic trigger if not enabled

    // Set searching state immediately for UI feedback
    if (query.trim().length >= minQueryLength) {
      setIsSearching(true);
    }

    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, minQueryLength, debounceMs, isDynamic]);

  // 3. Search Effect: Performs actual Algolia call when debouncedQuery changes (DYNAMIC MODE)
  useEffect(() => {
    if (isDynamic && debouncedQuery) {
      executeSearch(debouncedQuery);
    }
  }, [debouncedQuery, isDynamic, executeSearch]);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
    setShowResults(false);
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      // MIGRAION: Fetch from Firestore-backed API instead of Algolia direct
      const response = await axiosInstance.get("/web/products", {
        params: { size: 6 }
      });
      setRecommendations(response.data.dataList || []);
    } catch (error) {
      console.error("[useAlgoliaSearch] Failed to fetch recommendations:", error);
    }
  }, []);

  return {
    query,
    results,
    isSearching,
    showResults,
    search,
    executeSearch,
    fetchRecommendations,
    clearSearch,
    recommendations,
  };
}

export default useAlgoliaSearch;
