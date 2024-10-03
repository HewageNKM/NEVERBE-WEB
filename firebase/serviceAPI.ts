import {auth, inventoryCollectionRef} from "@/firebase/Config";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {doc, getDoc, getDocs} from "@firebase/firestore";
import {Item} from "@/interfaces";


export const signAnonymousUser = async () => {
    return await signInAnonymously(auth);
};

export const getInventoryByRecent = async () =>{
    let docs = await getDocs(inventoryCollectionRef);
    let items: Item[] = [];
    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })

    return items;
}
export const getInventory = async () =>{
    let docs = await getDocs(inventoryCollectionRef);
    let items: Item[] = [];
    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })

    return items;
}

export const getItemById = async (itemId:string) => {
    const itemDocRef = doc(inventoryCollectionRef, itemId);
    const itemDoc = await getDoc(itemDocRef);
    return itemDoc.data() as Item;
}
