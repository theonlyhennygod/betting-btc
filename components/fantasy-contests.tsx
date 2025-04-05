"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Zap } from "lucide-react"
import Link from "next/link"

export function FantasyContests() {
  const [contestType, setContestType] = useState("all")

  // Mock contest data
  const contests = [
    {
      id: "1",
      name: "NBA All-Stars",
      description: "Create your dream team of NBA stars",
      entryFee: 50000,
      prizePool: 1000000,
      entries: 1245,
      maxEntries: 5000,
      endsAt: "2025-04-07T23:59:59Z",
      sport: "NBA",
      type: "featured",
    },
    {
      id: "2",
      name: "Premier League Weekly",
      description: "Pick your Premier League XI for this weekend's matches",
      entryFee: 25000,
      prizePool: 500000,
      entries: 876,
      maxEntries: 2000,
      endsAt: "2025-04-06T12:00:00Z",
      sport: "Soccer",
      type: "featured",
    },
    {
      id: "3",
      name: "NFL Sunday Showdown",
      description: "Build your NFL roster for Sunday's games",
      entryFee: 100000,
      prizePool: 2000000,
      entries: 532,
      maxEntries: 3000,
      endsAt: "2025-04-10T18:00:00Z",
      sport: "NFL",
      type: "featured",
    },
    {
      id: "4",
      name: "MLB Opening Week",
      description: "Select your baseball dream team for opening week",
      entryFee: 20000,
      prizePool: 400000,
      entries: 1102,
      maxEntries: 2500,
      endsAt: "2025-04-08T19:00:00Z",
      sport: "MLB",
      type: "regular",
    },
    {
      id: "5",
      name: "Champions League Special",
      description: "Fantasy contest for Champions League knockout stage",
      entryFee: 75000,
      prizePool: 1500000,
      entries: 645,
      maxEntries: 2000,
      endsAt: "2025-04-09T20:45:00Z",
      sport: "Soccer",
      type: "special",
    },
    {
      id: "6",
      name: "NBA Playoffs",
      description: "Fantasy contest for the NBA playoff games",
      entryFee: 150000,
      prizePool: 3000000,
      entries: 324,
      maxEntries: 1000,
      endsAt: "2025-04-15T21:00:00Z",
      sport: "NBA",
      type: "special",
    },
    {
      id: "7",
      name: "Micro Stakes Daily",
      description: "Low entry fee daily fantasy contest",
      entryFee: 5000,
      prizePool: 100000,
      entries: 1876,
      maxEntries: 5000,
      endsAt: "2025-04-06T23:59:59Z",
      sport: "Multi-sport",
      type: "regular",
    },
  ]

  // Filter contests based on selected type
  const filteredContests = contestType === "all" ? contests : contests.filter((contest) => contest.type === contestType)

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
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setContestType}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
          <TabsTrigger value="regular">Regular</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContests.map((contest) => (
          <Card key={contest.id} className="bg-black/40 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{contest.name}</h3>
                  <p className="text-sm text-muted-foreground">{contest.description}</p>
                </div>
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">{contest.sport}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-zinc-800/50 p-2 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Entry Fee</div>
                  <div className="flex items-center">
                    <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                    <span className="text-sm font-medium">{contest.entryFee.toLocaleString()} sats</span>
                  </div>
                </div>

                <div className="bg-zinc-800/50 p-2 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Prize Pool</div>
                  <div className="flex items-center">
                    <Trophy className="h-3.5 w-3.5 text-amber-500 mr-1" />
                    <span className="text-sm font-medium">{contest.prizePool.toLocaleString()} sats</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {contest.entries.toLocaleString()} / {contest.maxEntries.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Ends: {formatDate(contest.endsAt)}</div>
              </div>

              <Button className="w-full" asChild>
                <Link href={`/fantasy/contests/${contest.id}`}>Enter Contest</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

