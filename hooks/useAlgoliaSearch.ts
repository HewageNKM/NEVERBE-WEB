import { useState, useCallback, useMemo, useEffect } from "react";
import { getAlgoliaClient } from "@/utils/bagCalculations";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";

interface UseAlgoliaSearchOptions {
  indexName?: string;
  hitsPerPage?: number;
  minQueryLength?: number;
  debounceMs?: number;
}

interface UseAlgoliaSearchReturn {
  query: string;
  results: Product[];
  isSearching: boolean;
  showResults: boolean;
  recommendations: Product[];
  search: (query: string) => void;
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
  } = options;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const searchClient = useMemo(() => getAlgoliaClient(), []);

  // 1. Debounce Effect: Updates debouncedQuery after user stops typing
  useEffect(() => {
    if (query.trim().length === 0) {
      setDebouncedQuery("");
      setResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    // Set searching state immediately for UI feedback
    if (query.trim().length >= minQueryLength) {
      setIsSearching(true);
    }

    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, minQueryLength, debounceMs]);

  // 2. Search Effect: Performs actual Algolia call when debouncedQuery changes
  useEffect(() => {
    const performSearch = async () => {
      const trimmedQuery = debouncedQuery.trim();
      if (trimmedQuery.length < minQueryLength) {
        setIsSearching(false);
        return;
      }

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
        let filteredResults = hits.filter(
          (item: any) =>
            item.status === true &&
            item.listing === true &&
            item.isDeleted === false,
        );

        filteredResults = filteredResults.filter(
          (item: any) =>
            !item.variants?.every(
              (v: ProductVariant) => v.isDeleted === true || v.status === false,
            ),
        );

        setResults(filteredResults);
        setShowResults(true);
      } catch (error) {
        console.error("[useAlgoliaSearch] Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    if (debouncedQuery) {
      performSearch();
    }
  }, [debouncedQuery, indexName, hitsPerPage, minQueryLength, searchClient]);

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
    const doFetch = async () => {
      const res = await searchClient.search({
        requests: [
          {
            indexName,
            query: "",
            hitsPerPage: 6,
          },
        ],
      });
      const hits = (res.results[0] as any)?.hits || [];
      const filtered = hits.filter(
        (item: any) =>
          item.status === true &&
          item.listing === true &&
          item.isDeleted === false,
      );
      setRecommendations(filtered);
    };

    try {
      await doFetch();
    } catch {
      // Retry once after a short delay (client may not be ready yet)
      try {
        await new Promise((r) => setTimeout(r, 1500));
        await doFetch();
      } catch {
        // Silently fail - recommendations are non-critical
      }
    }
  }, [searchClient, indexName]);

  return {
    query,
    results,
    isSearching,
    showResults,
    search,
    fetchRecommendations,
    clearSearch,
    recommendations,
  };
}

export default useAlgoliaSearch;
