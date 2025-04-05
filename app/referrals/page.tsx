"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Share2, Zap, Users, Gift, CheckCircle2 } from "lucide-react"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import Link from "next/link"

export default function ReferralsPage() {
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

  // Mock referral data
  const referralStats = {
    totalReferrals: 5,
    pendingReferrals: 2,
    totalEarned: 30000,
    availableRewards: 10000,
  }

  const referredFriends = [
    { id: 1, username: "satoshi21", status: "active", earned: 10000, date: "2025-03-28" },
    { id: 2, username: "lightning_lucy", status: "active", earned: 10000, date: "2025-03-25" },
    { id: 3, username: "bitcoinbob", status: "active", earned: 10000, date: "2025-03-20" },
    { id: 4, username: "node_runner", status: "pending", earned: 0, date: "2025-04-02" },
    { id: 5, username: "taproot_tim", status: "pending", earned: 0, date: "2025-04-01" },
  ]

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Referral Program</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-amber-500/20 p-4 rounded-full">
                  <Gift className="h-10 w-10 text-amber-500" />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-xl font-bold">Invite Friends & Earn Bitcoin</h2>
                  <p className="text-muted-foreground">
                    Share your referral link with friends. When they sign up and place their first bet, you'll both
                    receive 10,000 sats!
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                    <Input value={referralLink} readOnly className="bg-zinc-800/50 border-zinc-700" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={handleCopyLink} className="border-zinc-700">
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy link</span>
                      </Button>
                      <Button
                        onClick={handleShare}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-zinc-800">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Simple steps to earn Bitcoin rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-zinc-800/30 rounded-lg">
                  <div className="bg-amber-500/20 p-3 rounded-full mb-3">
                    <Share2 className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="font-medium mb-2">1. Share Your Link</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy your unique referral link and share it with friends via social media, email, or messaging apps.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 bg-zinc-800/30 rounded-lg">
                  <div className="bg-amber-500/20 p-3 rounded-full mb-3">
                    <Users className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="font-medium mb-2">2. Friends Sign Up</h3>
                  <p className="text-sm text-muted-foreground">
                    When your friends click your link and create an account, they'll be connected to your referral.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 bg-zinc-800/30 rounded-lg">
                  <div className="bg-amber-500/20 p-3 rounded-full mb-3">
                    <Zap className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="font-medium mb-2">3. Earn Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Once they place their first bet, you both receive 10,000 sats instantly to your Lightning wallets.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-zinc-800">
            <CardHeader>
              <CardTitle>Referred Friends</CardTitle>
              <CardDescription>Track your referrals and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="all">All ({referredFriends.length})</TabsTrigger>
                  <TabsTrigger value="active">
                    Active ({referredFriends.filter((f) => f.status === "active").length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({referredFriends.filter((f) => f.status === "pending").length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="rounded-md border border-zinc-800">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-800/50">
                            <th className="text-left p-3 text-sm font-medium">Username</th>
                            <th className="text-left p-3 text-sm font-medium">Date</th>
                            <th className="text-left p-3 text-sm font-medium">Status</th>
                            <th className="text-right p-3 text-sm font-medium">Reward</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referredFriends.map((friend) => (
                            <tr key={friend.id} className="border-b border-zinc-800">
                              <td className="p-3">{friend.username}</td>
                              <td className="p-3 text-sm text-muted-foreground">{formatDate(friend.date)}</td>
                              <td className="p-3">
                                {friend.status === "active" ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end">
                                  <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                                  <span>{friend.earned.toLocaleString()} sats</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="active">
                  <div className="rounded-md border border-zinc-800">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-800/50">
                            <th className="text-left p-3 text-sm font-medium">Username</th>
                            <th className="text-left p-3 text-sm font-medium">Date</th>
                            <th className="text-left p-3 text-sm font-medium">Status</th>
                            <th className="text-right p-3 text-sm font-medium">Reward</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referredFriends
                            .filter((f) => f.status === "active")
                            .map((friend) => (
                              <tr key={friend.id} className="border-b border-zinc-800">
                                <td className="p-3">{friend.username}</td>
                                <td className="p-3 text-sm text-muted-foreground">{formatDate(friend.date)}</td>
                                <td className="p-3">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Active
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end">
                                    <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                                    <span>{friend.earned.toLocaleString()} sats</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pending">
                  <div className="rounded-md border border-zinc-800">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-800/50">
                            <th className="text-left p-3 text-sm font-medium">Username</th>
                            <th className="text-left p-3 text-sm font-medium">Date</th>
                            <th className="text-left p-3 text-sm font-medium">Status</th>
                            <th className="text-right p-3 text-sm font-medium">Reward</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referredFriends
                            .filter((f) => f.status === "pending")
                            .map((friend) => (
                              <tr key={friend.id} className="border-b border-zinc-800">
                                <td className="p-3">{friend.username}</td>
                                <td className="p-3 text-sm text-muted-foreground">{formatDate(friend.date)}</td>
                                <td className="p-3">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500">
                                    Pending
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end">
                                    <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                                    <span>{friend.earned.toLocaleString()} sats</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-black/40 border-zinc-800">
            <CardHeader>
              <CardTitle>Your Rewards</CardTitle>
              <CardDescription>Track your referral earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Total Referrals</div>
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 text-amber-500 mr-1" />
                    <span className="font-medium">{referralStats.totalReferrals}</span>
                  </div>
                </div>

                <div className="bg-zinc-800/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Pending</div>
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 text-amber-500 mr-1" />
                    <span className="font-medium">{referralStats.pendingReferrals}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Total Earned</div>
                <div className="flex items-center">
                  <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                  <span className="font-medium">{referralStats.totalEarned.toLocaleString()} sats</span>
                </div>
              </div>

              <div className="bg-amber-500/10 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Available Rewards</div>
                <div className="flex items-center">
                  <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                  <span className="font-medium text-amber-500">
                    {referralStats.availableRewards.toLocaleString()} sats
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                <Zap className="mr-2 h-4 w-4" />
                Withdraw Rewards
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-black/40 border-zinc-800">
            <CardHeader>
              <CardTitle>Referral FAQ</CardTitle>
              <CardDescription>Common questions about our referral program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">How much can I earn?</h3>
                <p className="text-sm text-muted-foreground">
                  You earn 10,000 sats for each friend who signs up and places their first bet. There's no limit to how
                  many friends you can refer!
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-1">When do I get paid?</h3>
                <p className="text-sm text-muted-foreground">
                  Rewards are credited to your account instantly when your referred friend places their first bet.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-1">What do my friends get?</h3>
                <p className="text-sm text-muted-foreground">
                  Your friends also receive 10,000 sats bonus when they sign up through your link and place their first
                  bet.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-1">How do I withdraw my rewards?</h3>
                <p className="text-sm text-muted-foreground">
                  You can withdraw your rewards directly to your Lightning wallet at any time with no minimum amount.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-zinc-700" asChild>
                <Link href="/support">More Questions? Contact Support</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

