"use client"

import { Search, Bell, Menu, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface HeaderProps {
  onMenuClick: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

export function Header({ onMenuClick, searchValue, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-foreground">
              Dynamischer<span className="text-primary">+</span>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden flex-1 md:flex md:max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Suche nach Events, Orten, Genres…"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden sm:flex text-foreground hover:bg-secondary">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Benachrichtigungen</span>
            </Button>

            <Button variant="ghost" size="icon" className="hidden sm:flex text-foreground hover:bg-secondary">
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Chat</span>
            </Button>

            <Avatar className="h-10 w-10 cursor-pointer border border-border">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback className="bg-secondary text-foreground">US</AvatarFallback>
            </Avatar>

            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="md:hidden text-foreground hover:bg-secondary"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menü öffnen</span>
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Suche Events…"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
