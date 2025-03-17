"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, PaintBucket, Menu, X, Grid3X3, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import ConnectWallet from "./web3/ConnectWallet"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-black/30 border-b border-cyan-500/20">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-md rotate-12">
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">CAPY</span>
          </div>
          <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            CapyMinter
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-white/70 hover:text-cyan-400 transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link href="/mint" className="text-white/70 hover:text-cyan-400 transition-colors flex items-center gap-1">
            <PaintBucket className="h-4 w-4" />
            <span>Mint</span>
          </Link>
          <Link
            href="/collection"
            className="text-white/70 hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Collection</span>
          </Link>
        </nav>

        {/* Wallet Button */}
        <div className="hidden md:block">
          <ConnectWallet />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-20 z-40 bg-black/95 backdrop-blur-lg md:hidden transition-transform duration-300",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col p-6 space-y-6">
          <Link
            href="/"
            className="text-white/70 hover:text-cyan-400 transition-colors flex items-center gap-2 text-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            href="/mint"
            className="text-white/70 hover:text-cyan-400 transition-colors flex items-center gap-2 text-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            <PaintBucket className="h-5 w-5" />
            <span>Mint</span>
          </Link>
          <Link
            href="/collection"
            className="text-white/70 hover:text-cyan-400 transition-colors flex items-center gap-2 text-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>Collection</span>
          </Link>

          <div className="pt-6">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </header>
  )
}

