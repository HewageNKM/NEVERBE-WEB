import { Timestamp } from "firebase-admin/firestore";
import { formatInTimeZone } from "date-fns-tz";

export const toSafeLocaleString = (val: any) => {
  if (!val) {
    console.log("[UtilService] toSafeLocaleString → value is null or undefined");
    return null;
  }

  try {
    let date: Date;

    if (val instanceof Timestamp) {
      date = val.toDate();
      console.log("[UtilService] Firestore Timestamp detected:", date);
    } else if (typeof (val as Timestamp)?.toDate === "function") {
      date = (val as Timestamp).toDate();
      console.log("[UtilService] Timestamp-like object detected:", date);
    } else {
      date = new Date(val);
      console.log("[UtilService] Converted value to JS Date:", date);
    }

    if (isNaN(date.getTime())) {
      console.warn("[UtilService] Invalid date, returning original value:", val);
      return String(val);
    }

    const timeZone = "Asia/Colombo";
    const format = "dd/MM/yyyy, hh:mm:ss a";
    const formatted = formatInTimeZone(date, timeZone, format);

    console.log("[UtilService] Formatted date:", formatted);
    return formatted;
  } catch (error) {
    console.error("[UtilService] Error in toSafeLocaleString:", error, val);
    return String(val);
  }
};