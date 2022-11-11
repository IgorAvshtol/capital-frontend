import { createContext, useContext, useState } from 'react'


const AppContext = createContext()

export function AppWrapper({ children }) {
    const [isMobMenu, setIsMobMenu] = useState(false)

    const toggleMobMenu = () => {
        document.body.classList.toggle('body-popup-active')
        setIsMobMenu(!isMobMenu)
    }

    return (
        <AppContext.Provider value={{ isMobMenu, toggleMobMenu }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}