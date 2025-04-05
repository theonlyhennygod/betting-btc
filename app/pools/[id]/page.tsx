"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Clock, Trophy, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useLightningInvoice } from "@/hooks/use-lightning-invoice"
import { useWalletAuth } from "@/hooks/use-wallet-auth"

interface PoolPageProps {
  params: {
    id: string
  }
}

export default function PoolPage({ params }: PoolPageProps) {
  const poolId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useWalletAuth()
  const { createInvoice } = useLightningInvoice()
  const [isJoining, setIsJoining] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // Mock pool data
  const pool = {
    id: poolId,
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
    rules: [
      "Pick the winners of all NBA playoff games",
      "Each correct pick earns 1 point",
      "Tiebreakers determined by total points prediction",
      "Entries close 5 minutes before the first game",
      "Prizes paid automatically via Lightning Network",
    ],
    prizes: [
      { rank: "1st", amount: 2500000 },
      { rank: "2nd", amount: 1250000 },
      { rank: "3rd", amount: 750000 },
      { rank: "4th-10th", amount: 500000 },
    ],
    matches: [
      { id: "m1", homeTeam: "Lakers", awayTeam: "Nuggets", startTime: "2025-04-15T19:00:00Z" },
      { id: "m2", homeTeam: "Celtics", awayTeam: "76ers", startTime: "2025-04-15T21:30:00Z" },
      { id: "m3", homeTeam: "Bucks", awayTeam: "Heat", startTime: "2025-04-16T18:00:00Z" },
      { id: "m4", homeTeam: "Warriors", awayTeam: "Suns", startTime: "2025-04-16T20:30:00Z" },
    ],
    leaderboard: [
      { rank: 1, username: "SatoshiSam", points: 24, avatar: "S" },
      { rank: 2, username: "LightningLucy", points: 22, avatar: "L" },
      { rank: 3, username: "BitcoinBob", points: 21, avatar: "B" },
      { rank: 4, username: "NodeRunner", points: 19, avatar: "N" },
      { rank: 5, username: "TaprootTom", points: 18, avatar: "T" },
    ],
  }

  const handleJoinPool = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please connect your Lightning wallet to join pools",
      })
      return
    }

    setIsJoining(true)

    try {
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

      router.push(`/pools/${poolId}/predictions`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to join pool",
        description: "There was an error processing your payment",
      })
    } finally {
      setIsJoining(false)
    }
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
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8 border-zinc-700" asChild>
          <Link href="/pools">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-2xl">{pool.icon}</span>
            {pool.name}
          </h1>
          <p className="text-muted-foreground">{pool.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="details" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 space-y-4">
              <Card className="bg-black/40 border-zinc-800">
                <CardHeader>
                  <CardTitle>Pool Information</CardTitle>
                  <CardDescription>Details about this betting pool</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-800/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Prize Pool</div>
                      <div className="flex items-center">
                        <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                        <span className="font-medium">{pool.prizePool.toLocaleString()} sats</span>
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Entry Fee</div>
                      <div className="flex items-center">
                        <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                        <span className="font-medium">{pool.entryFee.toLocaleString()} sats</span>
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Entries</div>
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {pool.entries}/{pool.maxEntries}
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Ends In</div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{getTimeRemaining(pool.endsAt)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-zinc-800" />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Rules</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {pool.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>

                  <Separator className="bg-zinc-800" />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Prize Distribution</h3>
                    <div className="space-y-2">
                      {pool.prizes.map((prize, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-md">
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 text-amber-500 mr-2" />
                            <span>{prize.rank}</span>
                          </div>
                          <div className="text-amber-500 font-medium">{prize.amount.toLocaleString()} sats</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="matches" className="mt-4 space-y-4">
              <Card className="bg-black/40 border-zinc-800">
                <CardHeader>
                  <CardTitle>Matches</CardTitle>
                  <CardDescription>Games included in this pool</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pool.matches.map((match) => (
                      <div key={match.id} className="p-4 border border-zinc-800 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="text-center flex-1">
                            <div className="font-medium">{match.homeTeam}</div>
                            <div className="text-xs text-muted-foreground">Home</div>
                          </div>

                          <div className="px-4 text-center">
                            <div className="text-xs text-muted-foreground mb-1">VS</div>
                            <div className="text-xs bg-zinc-800 px-2 py-1 rounded">{formatDate(match.startTime)}</div>
                          </div>

                          <div className="text-center flex-1">
                            <div className="font-medium">{match.awayTeam}</div>
                            <div className="text-xs text-muted-foreground">Away</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-4 space-y-4">
              <Card className="bg-black/40 border-zinc-800">
                <CardHeader>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>Current standings in this pool</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left p-4 text-sm font-medium">Rank</th>
                          <th className="text-left p-4 text-sm font-medium">User</th>
                          <th className="text-right p-4 text-sm font-medium">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pool.leaderboard.map((user) => (
                          <tr
                            key={user.rank}
                            className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                          >
                            <td className="p-4">
                              {user.rank <= 3 ? (
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    user.rank === 1
                                      ? "bg-amber-500 text-black"
                                      : user.rank === 2
                                        ? "bg-zinc-400 text-black"
                                        : "bg-amber-800 text-white"
                                  }`}
                                >
                                  {user.rank}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">{user.rank}</span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-zinc-800">{user.avatar}</AvatarFallback>
                                </Avatar>
                                <span>{user.username}</span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end">
                                <Trophy className="h-3.5 w-3.5 text-amber-500 mr-1" />
                                <span>{user.points}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="bg-black/40 border-zinc-800 sticky top-20">
            <CardHeader>
              <CardTitle>Join This Pool</CardTitle>
              <CardDescription>Make your predictions and compete</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-800/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm">Entry Fee</div>
                  <div className="flex items-center text-amber-500">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    <span className="font-medium">{pool.entryFee.toLocaleString()} sats</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">Potential Win</div>
                  <div className="flex items-center text-amber-500">
                    <Trophy className="h-3.5 w-3.5 mr-1" />
                    <span className="font-medium">Up to {pool.prizes[0].amount.toLocaleString()} sats</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{pool.entries} entries</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Ends {formatDate(pool.endsAt)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={handleJoinPool}
                disabled={isJoining}
              >
                {isJoining ? (
                  "Processing..."
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Join Pool
                  </>
                )}
              </Button>

              {activeTab !== "leaderboard" && (
                <Button
                  variant="outline"
                  className="w-full border-zinc-700"
                  onClick={() => setActiveTab("leaderboard")}
                >
                  View Leaderboard
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

