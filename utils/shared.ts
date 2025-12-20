/**
 * Shared Utilities
 *
 * Common utility functions used across services and repositories.
 */

import { Timestamp } from "firebase-admin/firestore";
import { formatInTimeZone } from "date-fns-tz";

/**
 * Serialize Firestore Timestamp to ISO string for client components
 */
export const serializeTimestamp = (val: any): string | null => {
  if (!val) return null;
  if (typeof val.toDate === "function") {
    return val.toDate().toISOString();
  }
  if (val instanceof Date) {
    return val.toISOString();
  }
  return val;
};

/**
 * Convert timestamp to locale string (Asia/Colombo timezone)
 */
export const toSafeLocaleString = (val: any): string | null => {
  if (!val) return null;
  try {
    const date =
      typeof val.toDate === "function" ? val.toDate() : new Date(val);
    if (isNaN(date.getTime())) return String(val);
    return formatInTimeZone(date, "Asia/Colombo", "dd/MM/yyyy, hh:mm:ss a");
  } catch {
    return String(val);
  }
};

/**
 * Check if a date range is currently active
 */
export const isWithinDateRange = (
  startDate: Timestamp | string | null | undefined,
  endDate: Timestamp | string | null | undefined
): boolean => {
  const now = new Date();

  const start = startDate
    ? typeof (startDate as any).toDate === "function"
      ? (startDate as Timestamp).toDate()
      : new Date(startDate as string)
    : null;

  const end = endDate
    ? typeof (endDate as any).toDate === "function"
      ? (endDate as Timestamp).toDate()
      : new Date(endDate as string)
    : null;

  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
};

/**
 * Format currency (LKR)
 */
export const formatMoney = (amount: number = 0): string => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Generate SHA256 hash
 */
export const generateHash = async (input: string): Promise<string> => {
  const crypto = await import("crypto");
  return crypto.createHash("sha256").update(input).digest("hex");
};

/**
 * Clear timestamps from object (for client serialization)
 */
export const clearTimestamps = <T extends { createdAt?: any; updatedAt?: any }>(
  data: T
): T => ({
  ...data,
  createdAt: null,
  updatedAt: null,
});
