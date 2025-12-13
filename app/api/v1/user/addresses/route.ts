import { verifyToken } from "@/services/AuthService";
import { encryptData, decryptData } from "@/services/EncryptionService";
import { adminFirestore } from "@/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = await verifyToken(req);
    const uid = token.uid;

    const addressesRef = adminFirestore
      .collection("customers")
      .doc(uid)
      .collection("addresses");

    const snapshot = await addressesRef.get();

    const addresses = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: doc.id, // Using doc ID as type ('Shipping' or 'Billing')
        ...data,
        // Decrypt sensitive fields
        address: decryptData(data.address),
        city: decryptData(data.city),
        phone: decryptData(data.phone),
      };
    });

    return NextResponse.json(addresses);
  } catch (error: any) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const token = await verifyToken(req);
    const uid = token.uid;

    // Parse body
    const body = await req.json();
    const { type, address, city, phone, isDefault } = body;

    // Validate type
    if (!["Shipping", "Billing"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid address type. Must be 'Shipping' or 'Billing'." },
        { status: 400 }
      );
    }

    const docRef = adminFirestore
      .collection("users")
      .doc(uid)
      .collection("addresses")
      .doc(type); // ID is 'Shipping' or 'Billing'

    const dataToSave = {
      type,
      // Encrypt sensitive fields
      address: encryptData(address),
      city: encryptData(city),
      phone: encryptData(phone),
      default: !!isDefault,
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(dataToSave, { merge: true });

    return NextResponse.json({ success: true, message: "Address saved." });
  } catch (error: any) {
    console.error("Error saving address:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
