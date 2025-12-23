'use client'

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/AuthContext"

export function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <body className={`font-sans antialiased bg-background text-foreground`}>
      <AuthProvider>
        {children}
        <Analytics />
      </AuthProvider>
    </body>
  )
}