"use client"

import { X, Download, Share2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface QRCodeModalProps {
  ticket: {
    id: string
    eventTitle: string
    seat: string
    date: string
    qrCode: string
  }
  isOpen: boolean
  onClose: () => void
}

export function QRCodeModal({ ticket, isOpen, onClose }: QRCodeModalProps) {
  const [isAdded, setIsAdded] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-xl font-bold text-foreground">Your Ticket</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
            <span className="sr-only">Close modal</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Info */}
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h3 className="font-semibold text-foreground mb-3">{ticket.eventTitle}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Seat/Standing:</span> {ticket.seat}
              </p>
              <p>
                <span className="font-medium">Date:</span> {ticket.date}
              </p>
              <p>
                <span className="font-medium">Ticket ID:</span> {ticket.id}
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-xs aspect-square rounded-xl bg-white p-4 border-2 border-border flex items-center justify-center">
              {/* Simulated QR Code */}
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-400 rounded-lg mb-2">
                    <span className="text-white text-xs font-bold">QR</span>
                  </div>
                  <p className="text-xs text-gray-600 font-mono">{ticket.qrCode}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">Show this QR code at the entrance</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setIsAdded(!isAdded)}
              className={`w-full flex items-center justify-center gap-2 ${
                isAdded
                  ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              <Wallet className="h-4 w-4" />
              {isAdded ? "Added to wallet" : "Add to wallet"}
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-border bg-secondary text-foreground hover:bg-muted flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-border bg-secondary text-foreground hover:bg-muted flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3">
            <p className="text-xs text-blue-300">
              💡 Tip: Save your ticket in your wallet for quick access on event day.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
