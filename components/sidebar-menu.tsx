"use client"

import { Settings, History, CreditCard, HelpCircle, FileText, X, CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"

interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const { isOrganiser } = useAuth()

  const menuItems = [
    ...(isOrganiser ? [{ icon: CalendarPlus, label: "Events verwalten", href: "/manage" }] : []),
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: History, label: "Recent purchases", href: "/purchases" },
    { icon: CreditCard, label: "Payment methods", href: "/settings" },
    { icon: HelpCircle, label: "Support & Help", href: "/support" },
    { icon: FileText, label: "Legal", href: "/legal" },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={onClose} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="font-semibold text-sidebar-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <p className="text-xs text-sidebar-foreground/60">© 2025 Dynamischer+</p>
          </div>
        </div>
      </div>
    </>
  )
}
