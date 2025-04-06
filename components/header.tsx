"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bitcoin, ChevronDown, Gift, Menu, Shield, Sparkles, Trophy, Users, Wallet, Zap } from "lucide-react"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { UserRewardsDropdown } from "@/components/user-rewards-dropdown"

export default function Header() {
  const { isAuthenticated, login: connectWallet, logout: disconnectWallet, satBalance } = useWalletAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Bitcoin className="h-6 w-6 text-amber-500" />
            <span className="text-lg font-bold">Bit Bet</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/sports"
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
            >
              Sports
            </Link>
            <Link href="/live" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Live
            </Link>
            <Link
              href="/fantasy"
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
            >
              Fantasy
            </Link>
            <Link
              href="/pools"
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
            >
              Pools
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                >
                  More <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
                <DropdownMenuItem asChild>
                  <Link href="/referrals" className="cursor-pointer">
                    <Gift className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Referrals</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/escrows" className="cursor-pointer">
                    <Shield className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Taproot Escrows</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/leaderboard" className="cursor-pointer">
                    <Trophy className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Leaderboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tournaments" className="cursor-pointer">
                    <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Tournaments</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <UserRewardsDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-zinc-700">
                    <Wallet className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="hidden sm:inline">My Wallet</span>
                    <span className="ml-1.5 bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full text-xs">
                      {satBalance.toLocaleString()}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuLabel>Wallet</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem asChild>
                    <Link href="/wallet" className="cursor-pointer">
                      <Zap className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Deposit/Withdraw</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/escrows" className="cursor-pointer">
                      <Shield className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Taproot Escrows</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="cursor-pointer">
                      <Users className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Betting History</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem onClick={disconnectWallet} className="cursor-pointer">
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              onClick={connectWallet}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden border-zinc-700">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-900 border-zinc-800">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/sports"
                  className="text-sm font-medium hover:text-amber-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sports
                </Link>
                <Link
                  href="/live"
                  className="text-sm font-medium hover:text-amber-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Live
                </Link>
                <Link
                  href="/fantasy"
                  className="text-sm font-medium hover:text-amber-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Fantasy
                </Link>
                <Link
                  href="/pools"
                  className="text-sm font-medium hover:text-amber-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pools
                </Link>
                <Link
                  href="/referrals"
                  className="text-sm font-medium hover:text-amber-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Referrals
                </Link>
                <Link
                  href="/escrows"
                  className="text-sm font-medium hover:text-amber-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Taproot Escrows
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-sm font-medium hover:text-amber-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leaderboard
                </Link>
                <Link
                  href="/tournaments"
                  className="text-sm font-medium hover:text-amber-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tournaments
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

