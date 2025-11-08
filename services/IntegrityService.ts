import { adminFirestore } from "@/firebase/firebaseAdmin";
import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import stringify from "json-stable-stringify";

const HASH_SECRET = process.env.HASH_SECRET;

const generateDocumentHash = (docData: any) => {
  console.log("[Hash] Generating hash for document:", docData);

  const dataToHash = { ...docData };
  const canonicalString = stringify(dataToHash);
  console.log("[Hash] Canonical string for hashing:", canonicalString);

  const hashString = `${canonicalString}${HASH_SECRET}`;
  console.log("[Hash] String to hash (with secret):", hashString);

  const hash = crypto.createHash("sha256").update(hashString).digest("hex");
  console.log("[Hash] Generated SHA256 hash:", hash);

  return hash;
};

export const updateOrAddOrderHash = async (data: any) => {
  try {
    console.log("[Hash] Starting updateOrAddOrderHash process for order:", data.orderId);

    const hashValue = generateDocumentHash(data);
    const ledgerId = `hash_${data.orderId}`;

    console.log("[Hash] Ledger document ID:", ledgerId);
    console.log("[Hash] Saving hash to Firestore...");

    await adminFirestore.collection("hash_ledger").doc(ledgerId).set(
      {
        id: ledgerId,
        hashValue: hashValue,
        sourceCollection: "orders",
        sourceDocId: data.orderId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`[Hash] Hash ledger updated/created successfully for: ${ledgerId}`);
  } catch (error: any) {
    console.error("[Hash] Failed to create/update hash ledger:", error.message, error.stack);
    throw error;
  }
};
