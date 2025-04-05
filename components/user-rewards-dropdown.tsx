"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Gift, Share2, Zap } from "lucide-react"
import Link from "next/link"
import { useWalletAuth } from "@/hooks/use-wallet-auth"

export function UserRewardsDropdown() {
  const { isAuthenticated } = useWalletAuth()

  // Mock rewards data
  const rewardsData = {
    availableRewards: 10000,
    pendingReferrals: 2,
    totalEarned: 30000,
  }

  if (!isAuthenticated) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-zinc-700">
          <Gift className="h-4 w-4 mr-2 text-amber-500" />
          <span className="hidden sm:inline">Rewards</span>
          <span className="ml-1 bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full text-xs">
            {rewardsData.availableRewards.toLocaleString()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800">
        <DropdownMenuLabel>Your Rewards</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <div className="p-2">
          <div className="space-y-1.5 mb-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Available:</span>
              <span className="font-medium text-amber-500 flex items-center">
                <Zap className="h-3.5 w-3.5 mr-1" />
                {rewardsData.availableRewards.toLocaleString()} sats
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Pending Referrals:</span>
              <span>{rewardsData.pendingReferrals}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Earned:</span>
              <span className="flex items-center">
                <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
                {rewardsData.totalEarned.toLocaleString()} sats
              </span>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem asChild>
          <Link href="/referrals" className="cursor-pointer flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Invite Friends & Earn
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/referrals" className="cursor-pointer flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Withdraw Rewards
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

