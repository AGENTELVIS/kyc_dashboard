"use client"
import { createContext, ReactNode, useContext, useState } from "react";

type IUser = {
    name:string;
    setName:(name:string) => void
}

const UserContext = createContext<IUser | undefined>(undefined)

export const UserProvider = ({children}:{children:ReactNode}) => {
    const [name,setName] = useState("Change Your name");

    return(
        <UserContext.Provider value={{name,setName}}>
            {children}
        </UserContext.Provider>
    );
};

export function useUserContext(){
    const username = useContext(UserContext)
    if(!username){
        throw new Error("Check for UserProvider")
    }
    return username;
}