import React, { createContext, useState } from 'react'

// Create the context
export const UserContext = createContext()

// Create the context provider

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({})

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}
