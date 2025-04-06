"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Calculator, Trophy, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useLightningInvoice } from "@/hooks/use-lightning-invoice"
import { useWalletAuth } from "@/hooks/use-wallet-auth"

interface ContestPageProps {
  params: {
    id: string
  }
}

export default function ContestPage({ params }: ContestPageProps) {
  const contestId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useWalletAuth()
  const { createInvoice } = useLightningInvoice()
  const [selectedTeam, setSelectedTeam] = useState("")
  const [entryFee, setEntryFee] = useState("50000")
  const [isEntering, setIsEntering] = useState(false)

  // Mock contest data based on ID
  const contestData = {
    "1": {
      name: "NBA All-Stars",
      description: "Create your dream team of NBA stars and compete for the prize pool",
      entryFee: 50000,
      prizePool: 1000000,
      entries: 1245,
      endsAt: "2025-04-07T23:59:59Z",
      sport: "NBA",
    },
    "2": {
      name: "Premier League Weekly",
      description: "Pick your Premier League XI for this weekend's matches",
      entryFee: 25000,
      prizePool: 500000,
      entries: 876,
      endsAt: "2025-04-06T12:00:00Z",
      sport: "Soccer",
    },
    "3": {
      name: "NFL Sunday Showdown",
      description: "Build your NFL roster for Sunday's games",
      entryFee: 100000,
      prizePool: 2000000,
      entries: 532,
      endsAt: "2025-04-10T18:00:00Z",
      sport: "NFL",
    },
  }[contestId] || {
    name: "Fantasy Contest",
    description: "Join this fantasy contest to win sats",
    entryFee: 50000,
    prizePool: 1000000,
    entries: 500,
    endsAt: "2025-04-07T23:59:59Z",
    sport: "NBA",
  }

  const handleEnterContest = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please connect your Lightning wallet to enter contests",
      })
      return
    }

    if (!selectedTeam) {
      toast({
        variant: "destructive",
        title: "Team selection required",
        description: "Please select a team to enter this contest",
      })
      return
    }

    setIsEntering(true)

    try {
      // Create a BOLT11 invoice for the entry fee
      const invoice = await createInvoice({
        amount: Number.parseInt(entryFee),
        memo: `Entry fee for ${contestData.name} contest`,
        expiresIn: 600, // 10 minutes
      })

      // Simulate payment for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Contest entered successfully!",
        description: `You've entered ${contestData.name} with your team ${selectedTeam}`,
      })

      router.push("/fantasy")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to enter contest",
        description: "There was an error processing your payment",
      })
    } finally {
      setIsEntering(false)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8 border-zinc-700" asChild>
          <Link href="/fantasy">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{contestData.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-black/40 border-zinc-800">
            <CardHeader>
              <CardTitle>Contest Details</CardTitle>
              <CardDescription>{contestData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-800/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Entry Fee</div>
                  <div className="flex items-center">
                    <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                    <span className="font-medium">{contestData.entryFee.toLocaleString()} sats</span>
                  </div>
                </div>

                <div className="bg-zinc-800/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Prize Pool</div>
                  <div className="flex items-center">
                    <Trophy className="h-3.5 w-3.5 text-amber-500 mr-1" />
                    <span className="font-medium">{contestData.prizePool.toLocaleString()} sats</span>
                  </div>
                </div>

                <div className="bg-zinc-800/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Entries</div>
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 text-amber-500 mr-1" />
                    <span className="font-medium">{contestData.entries.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-zinc-800/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Ends At</div>
                  <div className="font-medium">{formatDate(contestData.endsAt)}</div>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              <div>
                <h3 className="text-lg font-medium mb-2">Prize Distribution</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-md">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-amber-500 mr-2" />
                      <span>1st Place</span>
                    </div>
                    <div className="text-amber-500 font-medium">
                      {Math.round(contestData.prizePool * 0.5).toLocaleString()} sats
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-md">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-zinc-400 mr-2" />
                      <span>2nd Place</span>
                    </div>
                    <div className="text-amber-500 font-medium">
                      {Math.round(contestData.prizePool * 0.25).toLocaleString()} sats
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-md">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-amber-800 mr-2" />
                      <span>3rd Place</span>
                    </div>
                    <div className="text-amber-500 font-medium">
                      {Math.round(contestData.prizePool * 0.15).toLocaleString()} sats
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-zinc-800/30 rounded-md">
                    <div>4th-10th Place</div>
                    <div className="text-amber-500 font-medium">
                      {Math.round((contestData.prizePool * 0.1) / 7).toLocaleString()} sats each
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              <div>
                <h3 className="text-lg font-medium mb-2">Rules</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>You must select a valid {contestData.sport} fantasy team</li>
                  <li>Points are awarded based on real player performance</li>
                  <li>Entry fees are non-refundable once the contest begins</li>
                  <li>Prizes are paid out automatically via Lightning Network</li>
                  <li>In case of a tie, the prize will be split equally</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-black/40 border-zinc-800">
            <CardHeader>
              <CardTitle>Enter Contest</CardTitle>
              <CardDescription>Select your team and pay the entry fee</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-select">Select Your Team</Label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger id="team-select" className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Choose a team" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="dream-team">Dream Team</SelectItem>
                    <SelectItem value="lightning-xi">Lightning XI</SelectItem>
                    <SelectItem value="new-team">+ Create New Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-fee">Entry Fee (sats)</Label>
                <div className="flex items-center">
                  <Input id="entry-fee" value={entryFee} readOnly className="bg-zinc-800 border-zinc-700" />
                  <Zap className="h-4 w-4 text-amber-500 -ml-8" />
                </div>
              </div>

              <div className="flex justify-between items-center bg-amber-500/10 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Potential Win</span>
                </div>
                <span className="text-sm font-medium text-amber-500">
                  Up to {contestData.prizePool.toLocaleString()} sats
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={handleEnterContest}
                disabled={isEntering || !selectedTeam}
              >
                {isEntering ? (
                  "Processing..."
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Enter Contest
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

