import { adminFirestore } from "@/firebase/firebaseAdmin";
import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import stringify from "json-stable-stringify";

const generateDocumentHash = (docData:any) => {
  // 1. Create a copy of the data
  const dataToHash = { ...docData };

  // 3. Create the canonical string (keys are sorted alphabetically)
  const canonicalString = stringify(dataToHash);

  // 4. Generate the hash
  const hash = crypto
    .createHash("sha256")
    .update(canonicalString)
    .digest("hex");

  return hash;
}

export const updateOrAddOrderHash = async (data:any) => {
  try {
    // 1. Generate the hash using the global helper
    const hashValue = generateDocumentHash(data);
    // 2. Use the standard naming convention: {collection}_{docId}
    const ledgerId = `hash_${data.orderId}`; // Assuming data has an orderId
    
    // 3. Save to the ledger
    await adminFirestore.collection('hash_ledger').doc(ledgerId).set({
      id: ledgerId,
      hashValue: hashValue,
      sourceCollection: 'orders', 
      sourceDocId: data.orderId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    
    console.log(`Hash ledger updated/created for: ${ledgerId}`);

  } catch (error) {
    console.error(`Failed to create hash:`, error);
    throw error;
  }
}
