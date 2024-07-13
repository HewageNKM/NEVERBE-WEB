'use client'
import Header from "@/components/sections/Header";
import Popular from "@/components/sections/Popular";
import Arrival from "@/components/sections/Arrival";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import {useGlobalContext} from "@/context/GlobalProvider";
import {useEffect} from "react";
import {getCurrentUser} from "@/firebase/Firebase";

export default function Home() {
    const {setUser, setIsLoggedIn} = useGlobalContext();
    const getUser = async ()=>{
        const usr = await getCurrentUser();
        if (usr){
            setIsLoggedIn(true)
            setUser(usr)
        }
    }
    useEffect(()=>{
        getUser()
    },[])
    return (
        <main className="w-full overflow-clip relative h-full px-4 py-4">
            <Header/>
            <Hero/>
            <Popular/>
            <Arrival/>
            <Footer/>
        </main>
    );
}
