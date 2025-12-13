import { adminFirestore } from "@/firebase/firebaseAdmin";
import { encryptData, decryptData } from "@/services/EncryptionService";

interface AddressData {
  type: "Shipping" | "Billing";
  address: string;
  city: string;
  phone: string;
  isDefault?: boolean;
}

export const getUserAddresses = async (uid: string) => {
  // Note: Standardizing on 'users' collection as per requirement to avoid 'customers' collection
  const addressesRef = adminFirestore
    .collection("users")
    .doc(uid)
    .collection("addresses");

  const snapshot = await addressesRef.get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      type: doc.id,
      ...data,
      // Decrypt
      address: decryptData(data.address, uid),
      city: decryptData(data.city, uid),
      phone: decryptData(data.phone, uid),
    };
  });
};

export const saveUserAddress = async (uid: string, data: AddressData) => {
  const { type, address, city, phone, isDefault } = data;

  const docRef = adminFirestore
    .collection("users")
    .doc(uid)
    .collection("addresses")
    .doc(type); // ID is 'Shipping' or 'Billing' based on type

  const dataToSave = {
    type,
    // Encrypt
    address: encryptData(address, uid),
    city: encryptData(city, uid),
    phone: encryptData(phone, uid),
    default: !!isDefault,
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(dataToSave, { merge: true });
  return { success: true, message: "Address saved." };
};
