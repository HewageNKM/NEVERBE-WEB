import {createContext, useContext, useState} from "react";

const GlobalContext = createContext({})
export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);

    return (
        <GlobalContext.Provider value={{isLoggedIn, setIsLoggedIn, cart, setCart, user, setUser}}>
            {children}
        </GlobalContext.Provider>
    );
};