import { createContext, Dispatch, SetStateAction } from 'react'
type User = {
    id: string;
    email: string;
    name: string;
    password: string;
    phoneNumber: number;
    storeName: string;
    productCategory: string[];
    staffCategory: string[];
    __v: number;
};

interface contextType {
    isLoggedIn: boolean,
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>,
    storeId: string,
    setIsStoreId: Dispatch<SetStateAction<string>>,
    userDetails: User | null,
    setUserDetails: Dispatch<SetStateAction<User | null>>
    extendTab: boolean,
    setExtendTab: Dispatch<SetStateAction<boolean>>,


}

export const AppContext = createContext<contextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    storeId: '',
    setIsStoreId: () => { },
    userDetails: null,
    setUserDetails: () => { },
    extendTab: false,
    setExtendTab: () => { }
})

