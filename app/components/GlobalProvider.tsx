"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseClient";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { initializeCart } from "@/redux/cartSlice/cartSlice";
import { AnimatePresence } from "framer-motion";
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "@/redux/authSlice/authSlice";
import Menu from "@/components/Menu";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const dispatch: AppDispatch = useDispatch();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const showCart = useSelector((state: RootState) => state.cartSlice.showCart);
  const showMenu = useSelector(
    (state: RootState) => state.headerSlice.showMenu
  );

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setUser(user));
        console.log("User Logged In");
      } else {
        console.log("No User Logged In");
      }
    });
    dispatch(initializeCart());
  });

  const fetchBrands = async () => {
    try {
      const result = await axios.get(`/api/v1/brands/dropdown`);
      setBrands(result.data || []);
    } catch (error: any) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await axios.get(`/api/v1/categories/dropdown`);
      setCategories(result.data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <main className="w-full relative flex flex-col justify-between min-h-screen overflow-clip">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <Header categories={categories} brands={brands} />
      {children}
      <Footer />
      <AnimatePresence>{showCart && <Cart />}</AnimatePresence>
      <AnimatePresence>{showMenu && <Menu />}</AnimatePresence>
    </main>
  );
};

export default GlobalProvider;
