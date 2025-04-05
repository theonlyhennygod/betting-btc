"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

interface WalletAuthContextType {
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => void
  satBalance: number
}

const WalletAuthContext = createContext<WalletAuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  satBalance: 0,
})

export function WalletAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [satBalance, setSatBalance] = useState(0)

  // Simulate loading wallet state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("lightning-auth")
    if (storedAuth) {
      setIsAuthenticated(true)
      setSatBalance(Math.floor(Math.random() * 1000000) + 100000) // Random balance for demo
    }
  }, [])

  const login = async () => {
    // Simulate LNURL-auth flow
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, this would verify the authentication with the Lightning node
    setIsAuthenticated(true)
    setSatBalance(Math.floor(Math.random() * 1000000) + 100000) // Random balance for demo
    localStorage.setItem("lightning-auth", "true")
  }

  const logout = () => {
    setIsAuthenticated(false)
    setSatBalance(0)
    localStorage.removeItem("lightning-auth")
  }

  return (
    <WalletAuthContext.Provider value={{ isAuthenticated, login, logout, satBalance }}>
      {children}
    </WalletAuthContext.Provider>
  )
}

export function useWalletAuth() {
  return useContext(WalletAuthContext)
}

