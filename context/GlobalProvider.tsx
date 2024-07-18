import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {getCurrentUser} from "@/firebase/Firebase";


const GlobalContext = createContext({})
export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalProvider = ({children}:{children:ReactNode}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const getUser = async () => {
        const usr = await getCurrentUser();
        if (usr) {
            setIsLoggedIn(true)
            setUser(usr)
        }
    }
    useEffect(() => {
        getUser()
    }, [])
    return (
        <GlobalContext.Provider value={{isLoggedIn, setIsLoggedIn, cart, setCart, user, setUser}}>
            {children}
        </GlobalContext.Provider>
    );
};