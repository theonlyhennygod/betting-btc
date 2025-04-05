"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Share2, Zap } from "lucide-react"
import { useWalletAuth } from "@/hooks/use-wallet-auth"

export function ReferralBanner() {
  const { toast } = useToast()
  const { isAuthenticated } = useWalletAuth()
  const [referralLink, setReferralLink] = useState("")

  // Generate a referral link when component mounts or when user authenticates
  useState(() => {
    if (isAuthenticated) {
      // In a real app, this would be a unique code from the backend
      const uniqueCode = Math.random().toString(36).substring(2, 10)
      setReferralLink(`https://boltbets.com/ref/${uniqueCode}`)
    }
  })

  const handleCopyLink = () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please connect your wallet to get your referral link",
      })
      return
    }

    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Referral link copied!",
      description: "Share this link with friends to earn rewards",
    })
  }

  const handleShare = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please connect your wallet to share your referral link",
      })
      return
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join BoltBets - Bitcoin Lightning Sports Betting",
          text: "Join me on BoltBets and get 10,000 sats bonus! Fast, non-custodial sports betting with Bitcoin Lightning.",
          url: referralLink,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <Card className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-amber-500/30">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-2 rounded-full">
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium">Invite Friends, Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Get 10,000 sats for each friend who joins and places a bet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {isAuthenticated ? (
              <>
                <Input value={referralLink} readOnly className="bg-zinc-800/50 border-zinc-700 max-w-[200px]" />
                <Button variant="outline" size="icon" onClick={handleCopyLink} className="border-zinc-700">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy link</span>
                </Button>
                <Button onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </>
            ) : (
              <Button onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Get Referral Link
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

