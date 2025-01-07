import {auth, getIdToken} from "@/firebase/firebaseClient";
import axios from "axios";
import {brandsURL} from "@/app/urls";

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
          url: '/api/inventory',
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  }catch (e) {
      throw e
  }
}