"use client";
import { useEffect, RefObject } from "react";

/**
 * Hook to detect clicks outside of a referenced element
 * Consolidates duplicate click-outside handler logic from Products, DealsProducts, CollectionProducts
 *
 * Usage:
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setIsOpen(false));
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback, enabled]);
}

export default useClickOutside;
