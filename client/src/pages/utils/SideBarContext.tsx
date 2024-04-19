
import { createContext, useState, useContext } from 'react';

//@ts-ignore
const MyContext = createContext();
//@ts-ignore
export const MyProvider = ({ children }) => {
    const [isCollapsed, setisCollapsed] = useState(false)

    return (
        <MyContext.Provider value={{ isCollapsed, setisCollapsed }}>
            {children}
        </MyContext.Provider>
    );
};


export const useMyContext = () => useContext(MyContext);
