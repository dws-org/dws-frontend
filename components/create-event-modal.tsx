"use client"

import type React from "react"

import { X, Upload, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: any) => void
}

export function CreateEventModal({ isOpen, onClose, onSave }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    totalTickets: "",
    category: "",
    image: "",
  })

  const [lineup, setLineup] = useState<string[]>([])
  const [currentArtist, setCurrentArtist] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...formData, lineup })
    onClose()
    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      price: "",
      totalTickets: "",
      category: "",
      image: "",
    })
    setLineup([])
  }

  const addArtist = () => {
    if (currentArtist.trim()) {
      setLineup([...lineup, currentArtist.trim()])
      setCurrentArtist("")
    }
  }

  const removeArtist = (index: number) => {
    setLineup(lineup.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-foreground">Event erstellen</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Event Bild URL</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                type="text"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1"
              />
              <Button type="button" variant="secondary" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {formData.image && (
              <div className="mt-2 overflow-hidden rounded-lg border border-border">
                <img src={formData.image || "/placeholder.svg"} alt="Preview" className="h-48 w-full object-cover" />
              </div>
            )}
          </div>

          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Titel *</Label>
            <Input
              id="title"
              type="text"
              placeholder="z.B. Techno Night 2025"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung *</Label>
            <Textarea
              id="description"
              placeholder="Beschreibe dein Event..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Datum *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Uhrzeit *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Ort *</Label>
            <Input
              id="location"
              type="text"
              placeholder="z.B. Berghain, Berlin"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategorie *</Label>
            <Input
              id="category"
              type="text"
              placeholder="z.B. Techno, House, Hip-Hop"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>

          {/* Price and Tickets */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Preis *</Label>
              <Input
                id="price"
                type="text"
                placeholder="z.B. 29,99 € oder Kostenlos"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalTickets">Anzahl Tickets *</Label>
              <Input
                id="totalTickets"
                type="number"
                placeholder="z.B. 500"
                value={formData.totalTickets}
                onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Line-up */}
          <div className="space-y-2">
            <Label>Line-up (optional)</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Künstler hinzufügen"
                value={currentArtist}
                onChange={(e) => setCurrentArtist(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addArtist()
                  }
                }}
              />
              <Button type="button" onClick={addArtist} variant="secondary" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {lineup.length > 0 && (
              <div className="mt-2 space-y-2">
                {lineup.map((artist, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary p-2 px-3"
                  >
                    <span className="text-sm text-foreground">{artist}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeArtist(index)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" className="flex-1">
              Event erstellen
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
