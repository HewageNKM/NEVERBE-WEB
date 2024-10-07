import {analytics, inventoryCollectionRef, slidersCollectionRef} from "@/firebase/Config";
import {doc, getDoc, getDocs, limit, orderBy, where} from "@firebase/firestore";
import {Item, Slide} from "@/interfaces";
import {query} from "@firebase/database";
import {logEvent} from "@firebase/analytics";

export const getInventoryByRecent = async () => {
    const recentInventoryDataQuery = query(inventoryCollectionRef, orderBy('createdAt', 'desc'), limit(16));
    const docs = await getDocs(recentInventoryDataQuery);

    let items: Item[] = [];

    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })

    return items;
}
export const getInventory = async () => {
    let docs = await getDocs(inventoryCollectionRef);
    let items: Item[] = [];
    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })

    return items;
}

export const getItemsByBrandName = async (name:string) => {
    const brandItemsQuery = query(inventoryCollectionRef, where('brand', '==', name));
    const docs = await getDocs(brandItemsQuery);
    let items: Item[] = [];
    docs.forEach(doc => {
        items.push(doc.data() as Item);
    })

    return items;
}

export const getItemById = async (itemId: string) => {
    const itemDocRef = doc(inventoryCollectionRef, itemId);
    const itemDoc = await getDoc(itemDocRef);
    if (itemDoc.exists()) {
        const itemData = itemDoc.data();
        return {
            ...itemData,
            createdAt: itemData.createdAt.toDate().toISOString(),
        } as Item;
    } else {
        return null;
    }
}

export const getHotsProducts = async () => {
    return [];
}

export const getSliders = async () => {
    let docs = await getDocs(slidersCollectionRef);
    let sliders: Slide[] = [];
    docs.forEach(doc => {
        sliders.push(doc.data() as Slide);
    })

    return sliders;
}

export const log = async (eventName: string, eventParams: any) => {
    logEvent(analytics, eventName, eventParams);
    console.log(eventName, eventParams);
}