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

export const getProducts = async (gender:string,page:number=1,limit:number=20) => {
  try {
      const token = await getIdToken();
      const response = await axios({
          method: 'GET',
          url: getInventoryURL+`?gender=${gender}&page=${page}&limit=${limit}`,
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  }catch (e) {
      throw e
  }
}

export const getInventoryByManufacturer = async (name:string,page:number=1,limit:number=20) => {
    try {
        const token = await getIdToken();
        const response = await axios({
            method: 'GET',
            url: getInventoryURL+`?manufacturer=${name}&page=${page}&limit=${limit}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }catch (e) {
        throw e
    }
}

export const getInventoryByTwoFields = async (value1:string,value2:string,field1:string,field2:string,page:number=1,limit:number=20) => {
    try {
        const token = await getIdToken();
        const response = await axios({
            method: 'GET',
            url: getInventoryURL+`?${field1}=${value1}&${field2}=${value2}&page=${page}&limit=${limit}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data)
        return response.data;
    }catch (e) {
        throw e
    }
}