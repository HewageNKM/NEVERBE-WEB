"use client"
import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {showCart} from "@/redux/cartSlice/cartSlice";
import {IoCartOutline, IoMenu, IoSearch} from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import {Banner, Logo} from "@/assets/images";
import SearchDialog from "@/components/SearchDialog";
import {getAlgoliaClient} from "@/util";
import {Item} from "@/interfaces";
import {AnimatePresence} from "framer-motion";
import {toggleMenu} from "@/redux/headerSlice/headerSlice";

const Header = () => {
    const cartItems = useSelector((state: RootState) => state.cartSlice.cart);
    const dispatch: AppDispatch = useDispatch();
    const [showSearchResult, setShowSearchResult] = useState(false)
    const [items, setItems] = useState([]);
    const [isSearching, setIsSearching] = useState(false)
    const searchClient = getAlgoliaClient()
    const [search, setSearch] = useState("")

    const searchItems = async (evt) => {
        setSearch(evt.target.value)
        try {
            if (evt.target.value.toString().trim().length < 3) {
                setItems([])
                setShowSearchResult(false)
                return
            }

            setIsSearching(true)
            const search = evt.target.value.toString().trim()
            const searchResults = await searchClient.search({
                requests: [{indexName: "inventory_index", query: search, hitsPerPage: 30}]
            });
            const filteredResults = searchResults.results[0].hits.filter((item: Item) => (item.status === "Active" && item.listing == "Active"))
            setItems(filteredResults)
            setShowSearchResult(true)
        } catch (e) {
            console.log(e)
        } finally {
            setIsSearching(false)
        }
    }
    return (
        <header className="z-50 bg-black w-full fixed">
            <div className="flex justify-between items-center p-4">
                <figure className="hidden lg:block p-1">
                    <Link href={"/"}>
                        <Image src={Logo} alt={"Logo"} width={100} height={100}/>
                    </Link>
                </figure>
                <figure className="lg:hidden block">
                    <Link href={"/"}>
                        <Image src={Banner} alt={"Banner"} width={180} height={180}/>
                    </Link>
                </figure>
                <nav className="hidden lg:absolute lg:flex w-full justify-center items-center">
                    <ul className="flex text-white gap-4 text-xl">
                        <li>
                            <Link href={"/"} className="hover:text-primary-100">Home</Link>
                        </li>
                        <li>
                            <Link href={"/collections/products"} className="hover:text-primary-100">Shop</Link>
                        </li>
                        <li>
                            <Link href={"/aboutUs"} className="hover:text-primary-100">About Us</Link>
                        </li>
                        <li>
                            <Link href={"/contact"} className="hover:text-primary-100">Contact Us</Link>
                        </li>
                    </ul>
                </nav>
                <div className="flex text-white  flex-row gap-3 items-center">
                    <div className="relative hidden lg:block w-fit">
                        {isSearching ? (
                            <div
                                className="w-5 h-5 border-2 border-gray-300 border-t-2 border-t-primary-200 rounded-full animate-spin absolute top-2 right-2 transition-all duration-300"></div>
                        ) : (
                            <IoSearch size={20} className="text-gray-600 absolute top-2 right-2"/>
                        )}
                        <input value={search} type="text" placeholder="search for products"
                               onChange={(e) => searchItems(e)}
                               className="py-2 pr-8 text-black px-4 w-[15rem] h-[2.5rem] rounded-md text-sm"/>
                        <AnimatePresence>
                            {(showSearchResult && items.length > 0) && <SearchDialog results={items} onClick={()=>{
                                setShowSearchResult(false)
                                setSearch("")
                            }}/>}
                        </AnimatePresence>
                    </div>
                    <div className="relative p-2 hover:bg-gray-900 rounded-full">
                        <button className="text-white" onClick={() => dispatch(showCart())}>
                            <IoCartOutline size={30}/>
                        </button>
                        <span className="absolute -top-2 p-1 right-0 bg-primary text-white text-xs rounded-full ">
                        {cartItems.length}</span>
                    </div>
                    <div className="lg:hidden block ">
                        <button onClick={()=> dispatch(toggleMenu(true))}>
                            <IoMenu size={30}/>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
