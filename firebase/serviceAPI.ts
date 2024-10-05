import {auth, inventoryCollectionRef, slidersCollectionRef} from "@/firebase/Config";
import {onAuthStateChanged, signInAnonymously} from "firebase/auth";
import {doc, getDoc, getDocs, limit, orderBy} from "@firebase/firestore";
import {Item, Slide} from "@/interfaces";
import {query} from "@firebase/database";


export const signUser = async (callBack: any) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            callBack(user);
        } else {
            signInAnonymously(auth)
                .then((userCredential) => {
                    callBack(userCredential.user);
                })
                .catch((error) => {
                    console.log('Error signing in anonymously:', error);
                });
        }
    })
};

export const getInventoryByRecent = async () => {
    const recentInventoryDataQuery = query(inventoryCollectionRef, orderBy('createdAt', 'desc'), limit(12));
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

export const getItemById = async (itemId: string) => {
    const itemDocRef = doc(inventoryCollectionRef, itemId);
    const itemDoc = await getDoc(itemDocRef);
    return itemDoc.data() as Item;
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