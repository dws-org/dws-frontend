"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import keycloak from '@/lib/keycloak'

interface AuthContextType {
  user: any
  roles: string[]
  isOrganiser: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!keycloak) {
      setIsLoading(false)
      return
    }

    keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    }).then((auth: boolean) => {
      setAuthenticated(auth)
      setIsLoading(false)

      if (auth) {
        // User Profile laden
        keycloak.loadUserProfile().then((profile: any) => {
          setUser(profile)
        })

        // Rollen aus Token auslesen
        const tokenParsed = keycloak.tokenParsed as any
        console.log("Token Parsed:", tokenParsed)
        console.log("Token Parsed:", keycloak.token)
        const realmRoles = tokenParsed?.realm_access?.roles || []
        const clientRoles = tokenParsed?.resource_access?.['dws-frontend']?.roles || []
        const allRoles = [...realmRoles, ...clientRoles]
        
        console.log("User Roles:", allRoles)
        setRoles(allRoles)
      }
    }).catch((err: any) => {
      console.error('Keycloak init error:', err)
      setIsLoading(false)
    })
  }, [])

  const logout = () => {
    keycloak?.logout()
  }

  // Prüfen ob User die Organiser Rolle hat
  const isOrganiser = roles.includes('organiser') || roles.includes('Organiser')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, roles, isOrganiser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}