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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("1. Keycloak vorhanden?", keycloak)

    if (!keycloak) {
      console.log("2. Kein Keycloak!")
      setIsLoading(false)
      return
    }

    console.log("3. Starte Keycloak init...")

    keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    }).then((auth: boolean) => {
      console.log("4. Keycloak init erfolgreich, authenticated:", auth)
      setAuthenticated(auth)
      setIsLoading(false)

      if (auth) {
        keycloak.loadUserProfile().then((profile: any) => {
          console.log("5. User Profile:", profile)
          setUser(profile)
        })
      }
    }).catch((err: any) => {
      console.error('Keycloak init error:', err)
      setIsLoading(false)
    })
  }, [])

  const logout = () => {
    keycloak?.logout()
  }

  if (isLoading) {
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