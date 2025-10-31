import { adminFirestore } from "@/firebase/firebaseAdmin";
import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import stringify from "json-stable-stringify";

const HASH_SECRET = process.env.HASH_SECRET;

const generateDocumentHash = (docData:any) => {
  const dataToHash = { ...docData };
  const canonicalString = stringify(dataToHash);
  const hashString = `${canonicalString}${HASH_SECRET}`
  const hash = crypto
    .createHash("sha256")
    .update(hashString)
    .digest("hex");

  return hash;
}

export const updateOrAddOrderHash = async (data:any) => {
  try {
    const hashValue = generateDocumentHash(data);
    const ledgerId = `hash_${data.orderId}`;
    
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
