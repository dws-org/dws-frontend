"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import keycloak from '@/lib/keycloak'

interface AuthContextType {
  user: any
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Initialize Keycloak (genau wie bei deinem Prof)
    keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    }).then(auth => {
      setAuthenticated(auth)

      if (auth) {
        keycloak.loadUserProfile().then(profile => {
          setUser(profile)
        })
      }
    })
  }, [])

  const logout = () => {
    keycloak.logout()
  }

  // Zeige Loading während Keycloak lädt
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}