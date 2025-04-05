"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Clock, Copy, Info, Plus, Trophy, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { useLightningInvoice } from "@/hooks/use-lightning-invoice"

export function BettingPools() {
  const { toast } = useToast()
  const { isAuthenticated } = useWalletAuth()
  const { createInvoice } = useLightningInvoice()
  const [poolType, setPoolType] = useState("featured")
  const [isJoiningPool, setIsJoiningPool] = useState(false)
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [isCreatingPool, setIsCreatingPool] = useState(false)
  const [newPoolName, setNewPoolName] = useState("")
  const [newPoolType, setNewPoolType] = useState("pick-em")
  const [newPoolEntryFee, setNewPoolEntryFee] = useState("10000")
  const [inviteCode, setInviteCode] = useState("")

  // Mock pools data
  const pools = {
    featured: [
      {
        id: "pool-1",
        name: "NBA Playoff Winners",
        description: "Pick the winners of all NBA playoff games",
        entryFee: 50000,
        prizePool: 5000000,
        entries: 87,
        maxEntries: 1000,
        endsAt: "2025-04-15T23:59:59Z",
        type: "pick-em",
        sport: "NBA",
        icon: "🏀",
      },
      {
        id: "pool-2",
        name: "Premier League Goal Scorers",
        description: "Predict which players will score this weekend",
        entryFee: 25000,
        prizePool: 2500000,
        entries: 112,
        maxEntries: 500,
        endsAt: "2025-04-06T12:30:00Z",
        type: "prop-bets",
        sport: "Soccer",
        icon: "⚽",
      },
      {
        id: "pool-3",
        name: "MLB Opening Day",
        description: "Pick winners for all opening day games",
        entryFee: 20000,
        prizePool: 1000000,
        entries: 45,
        maxEntries: 200,
        endsAt: "2025-04-07T18:00:00Z",
        type: "pick-em",
        sport: "MLB",
        icon: "⚾",
      },
      {
        id: "pool-4",
        name: "Golf Majors Birdie Challenge",
        description: "Predict total birdies for top 10 players",
        entryFee: 100000,
        prizePool: 10000000,
        entries: 58,
        maxEntries: 100,
        endsAt: "2025-04-10T07:00:00Z",
        type: "over-under",
        sport: "Golf",
        icon: "🏌️",
      },
    ],
    private: [
      {
        id: "private-1",
        name: "Satoshi's NFL Picks",
        description: "Private pool for NFL game predictions",
        entryFee: 50000,
        prizePool: 250000,
        entries: 5,
        maxEntries: 10,
        endsAt: "2025-04-12T20:00:00Z",
        type: "pick-em",
        sport: "NFL",
        icon: "🏈",
        inviteCode: "NFL2025",
      },
      {
        id: "private-2",
        name: "Lightning League UFC",
        description: "Predict UFC fight outcomes with friends",
        entryFee: 100000,
        prizePool: 500000,
        entries: 4,
        maxEntries: 5,
        endsAt: "2025-04-08T22:00:00Z",
        type: "prop-bets",
        sport: "UFC",
        icon: "🥊",
        inviteCode: "UFC2025",
      },
    ],
    my: [
      {
        id: "my-1",
        name: "NBA Playoff Winners",
        description: "Pick the winners of all NBA playoff games",
        entryFee: 50000,
        prizePool: 5000000,
        entries: 87,
        maxEntries: 1000,
        endsAt: "2025-04-15T23:59:59Z",
        type: "pick-em",
        sport: "NBA",
        icon: "🏀",
        myPredictions: 8,
        totalPredictions: 12,
      },
      {
        id: "my-2",
        name: "Lightning League UFC",
        description: "Predict UFC fight outcomes with friends",
        entryFee: 100000,
        prizePool: 500000,
        entries: 4,
        maxEntries: 5,
        endsAt: "2025-04-08T22:00:00Z",
        type: "prop-bets",
        sport: "UFC",
        icon: "🥊",
        myPredictions: 5,
        totalPredictions: 5,
        myRank: 1,
      },
    ],
  }

  const handleJoinPool = async (poolId: string) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please connect your Lightning wallet to join pools",
      })
      return
    }

    setIsJoiningPool(true)
    setSelectedPool(poolId)

    try {
      // Find the pool
      const pool = [...pools.featured, ...pools.private].find((p) => p.id === poolId)

      if (!pool) {
        throw new Error("Pool not found")
      }

      // Create a BOLT11 invoice for the entry fee
      const invoice = await createInvoice({
        amount: pool.entryFee,
        memo: `Entry fee for ${pool.name} pool`,
        expiresIn: 600, // 10 minutes
      })

      // Simulate payment for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Pool joined successfully!",
        description: `You've joined the ${pool.name} pool`,
      })

      // Reset state
      setIsJoiningPool(false)
      setSelectedPool(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to join pool",
        description: "There was an error processing your payment",
      })
      setIsJoiningPool(false)
      setSelectedPool(null)
    }
  }

  const handleCreatePool = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please connect your Lightning wallet to create pools",
      })
      return
    }

    if (!newPoolName) {
      toast({
        variant: "destructive",
        title: "Pool name required",
        description: "Please enter a name for your pool",
      })
      return
    }

    setIsCreatingPool(true)

    // Generate a random invite code
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Simulate pool creation
    setTimeout(() => {
      setInviteCode(generatedCode)
      setIsCreatingPool(false)

      toast({
        title: "Pool created successfully!",
        description: `Your pool "${newPoolName}" has been created`,
      })
    }, 1500)
  }

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode)

    toast({
      title: "Invite code copied!",
      description: "Share this code with friends to join your pool",
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  // Calculate time remaining
  const getTimeRemaining = (dateString: string) => {
    const now = new Date()
    const endDate = new Date(dateString)
    const diffMs = endDate.getTime() - now.getTime()

    if (diffMs <= 0) {
      return "Ended"
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      return `${diffHours}h ${diffMinutes}m`
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Betting Pools</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Pool Info</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
                <DialogHeader>
                  <DialogTitle>How Pools Work</DialogTitle>
                  <DialogDescription>Join pools to compete against other bettors for big prizes</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500/20 p-2 rounded-full">
                      <Trophy className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Pick Your Contest</h3>
                      <p className="text-sm text-muted-foreground">Choose from various sports and prediction types</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500/20 p-2 rounded-full">
                      <Zap className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Make Your Predictions</h3>
                      <p className="text-sm text-muted-foreground">Submit your picks before the deadline</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500/20 p-2 rounded-full">
                      <Users className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Compete & Win</h3>
                      <p className="text-sm text-muted-foreground">Climb the leaderboard and win Bitcoin prizes</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">Join prediction contests and win big prizes</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Pool
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle>Create Betting Pool</DialogTitle>
              <DialogDescription>Create a private pool and invite your friends</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="pool-name">Pool Name</Label>
                <Input
                  id="pool-name"
                  placeholder="Enter pool name"
                  value={newPoolName}
                  onChange={(e) => setNewPoolName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pool-type">Pool Type</Label>
                <Select value={newPoolType} onValueChange={setNewPoolType}>
                  <SelectTrigger id="pool-type" className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select pool type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="pick-em">Pick'em (Game Winners)</SelectItem>
                    <SelectItem value="prop-bets">Prop Bets</SelectItem>
                    <SelectItem value="over-under">Over/Under</SelectItem>
                    <SelectItem value="survivor">Survivor Pool</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-fee">Entry Fee (sats)</Label>
                <div className="flex items-center">
                  <Input
                    id="entry-fee"
                    value={newPoolEntryFee}
                    onChange={(e) => setNewPoolEntryFee(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <Zap className="h-4 w-4 text-amber-500 -ml-8" />
                </div>
              </div>

              {inviteCode && (
                <div className="space-y-2">
                  <Label htmlFor="invite-code">Invite Code</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="invite-code" value={inviteCode} readOnly className="bg-zinc-800 border-zinc-700" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-zinc-700"
                      onClick={handleCopyInviteCode}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={handleCreatePool}
                disabled={isCreatingPool}
              >
                {isCreatingPool ? "Creating..." : "Create Pool"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="featured" onValueChange={setPoolType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="featured">Featured Pools</TabsTrigger>
          <TabsTrigger value="private">Private Pools</TabsTrigger>
          <TabsTrigger value="my">My Pools</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {pools.featured.map((pool) => (
              <Card key={pool.id} className="bg-black/40 border-zinc-800 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{pool.icon}</span>
                      <div>
                        <h3 className="font-medium">{pool.name}</h3>
                        <p className="text-sm text-muted-foreground">{pool.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Prize Pool</div>
                        <div className="flex items-center text-amber-500">
                          <Zap className="h-3.5 w-3.5 mr-1" />
                          <span className="font-medium">{pool.prizePool.toLocaleString()} sats</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Entry Fee</div>
                        <div className="flex items-center">
                          <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
                          <span className="font-medium">{pool.entryFee.toLocaleString()} sats</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Entries</div>
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {pool.entries}/{pool.maxEntries}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Ends In</div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{getTimeRemaining(pool.endsAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:w-64 bg-zinc-800/30 flex flex-col justify-center space-y-4">
                    <Badge className="w-fit">{pool.sport}</Badge>
                    <Button
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                      onClick={() => handleJoinPool(pool.id)}
                      disabled={isJoiningPool && selectedPool === pool.id}
                    >
                      {isJoiningPool && selectedPool === pool.id ? (
                        "Processing..."
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Join Pool
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full border-zinc-700" asChild>
                      <Link href={`/pools/${pool.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="private" className="mt-4">
          <Card className="bg-black/40 border-zinc-800 mb-4">
            <CardHeader>
              <CardTitle>Join Private Pool</CardTitle>
              <CardDescription>Enter an invite code to join a private pool</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input placeholder="Enter invite code" className="bg-zinc-800 border-zinc-700" />
                <Button>Join</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {pools.private.map((pool) => (
              <Card key={pool.id} className="bg-black/40 border-zinc-800 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{pool.icon}</span>
                      <div>
                        <h3 className="font-medium">{pool.name}</h3>
                        <p className="text-sm text-muted-foreground">{pool.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Prize Pool</div>
                        <div className="flex items-center text-amber-500">
                          <Zap className="h-3.5 w-3.5 mr-1" />
                          <span className="font-medium">{pool.prizePool.toLocaleString()} sats</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Entry Fee</div>
                        <div className="flex items-center">
                          <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
                          <span className="font-medium">{pool.entryFee.toLocaleString()} sats</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Entries</div>
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {pool.entries}/{pool.maxEntries}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Ends In</div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{getTimeRemaining(pool.endsAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:w-64 bg-zinc-800/30 flex flex-col justify-center space-y-4">
                    <Badge className="w-fit">{pool.sport}</Badge>
                    <Button
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                      onClick={() => handleJoinPool(pool.id)}
                      disabled={isJoiningPool && selectedPool === pool.id}
                    >
                      {isJoiningPool && selectedPool === pool.id ? (
                        "Processing..."
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Join Pool
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full border-zinc-700" asChild>
                      <Link href={`/pools/${pool.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my" className="mt-4">
          {pools.my.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pools.my.map((pool) => (
                <Card key={pool.id} className="bg-black/40 border-zinc-800 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{pool.icon}</span>
                        <div>
                          <h3 className="font-medium">{pool.name}</h3>
                          <p className="text-sm text-muted-foreground">{pool.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Prize Pool</div>
                          <div className="flex items-center text-amber-500">
                            <Zap className="h-3.5 w-3.5 mr-1" />
                            <span className="font-medium">{pool.prizePool.toLocaleString()} sats</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground">My Predictions</div>
                          <div className="flex items-center">
                            <span className="font-medium">
                              {pool.myPredictions}/{pool.totalPredictions}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground">Entries</div>
                          <div className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1" />
                            <span>
                              {pool.entries}/{pool.maxEntries}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground">Ends In</div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{getTimeRemaining(pool.endsAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:w-64 bg-zinc-800/30 flex flex-col justify-center space-y-4">
                      {pool.myRank && (
                        <div className="text-center mb-2">
                          <div className="text-xs text-muted-foreground">Current Rank</div>
                          <div className="text-2xl font-bold text-amber-500">#{pool.myRank}</div>
                        </div>
                      )}

                      <Button className="w-full" asChild>
                        <Link href={`/pools/${pool.id}/predictions`}>
                          {pool.myPredictions < pool.totalPredictions ? <>Make Predictions</> : <>Edit Predictions</>}
                        </Link>
                      </Button>

                      <Button variant="outline" className="w-full border-zinc-700" asChild>
                        <Link href={`/pools/${pool.id}`}>View Leaderboard</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Pools Joined Yet</h3>
              <p className="text-muted-foreground mb-6">You haven't joined any betting pools yet</p>
              <Button
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={() => setPoolType("featured")}
              >
                Browse Featured Pools
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

