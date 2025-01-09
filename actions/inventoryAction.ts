import {auth, getIdToken} from "@/firebase/firebaseClient";
import axios from "axios";
import {brandsURL, getInventoryURL} from "@/app/urls";

export const getBrands = async () => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios({
            method: 'GET',
            url: brandsURL,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (e) {
        throw e
    }
}

export const getProducts = async () => {
  try {
      const token = await getIdToken();
      const response = await axios({
          method: 'GET',
          url: getInventoryURL,
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  }catch (e) {
      throw e
  }
}

export const getInventoryByManufacturer = async (name:string) => {
    try {
        const token = await getIdToken();
        const response = await axios({
            method: 'GET',
            url: getInventoryURL+`/manufacturers/${name}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }catch (e) {
        throw e
    }
}