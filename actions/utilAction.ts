import { formatInTimeZone } from "date-fns-tz";

export const toSafeLocaleString = (val: any) => {
  if (!val) {
    console.log(
      "[UtilService] toSafeLocaleString → value is null or undefined"
    );
    return null;
  }

  try {
    let date: Date;

    // Check for Firestore Timestamp (duck typing to avoid importing firebase-admin or firebase/firestore in client/server shared code improperly)
    if (val && typeof val.toDate === "function") {
      date = val.toDate();
      console.log("[UtilService] Timestamp-like object detected:", date);
    } else {
      date = new Date(val);
      console.log("[UtilService] Converted value to JS Date:", date);
    }

    if (isNaN(date.getTime())) {
      console.warn(
        "[UtilService] Invalid date, returning original value:",
        val
      );
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
