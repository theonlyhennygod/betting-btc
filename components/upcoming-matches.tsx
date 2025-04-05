"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MatchCard } from "@/components/match-card"
import { sportFixtures } from "@/lib/fixtures"

export function UpcomingMatches() {
  const [selectedSport, setSelectedSport] = useState("nba")

  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardHeader>
        <CardTitle>Upcoming Matches</CardTitle>
        <CardDescription>Place your bets on upcoming sports events</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nba" onValueChange={setSelectedSport}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="nba">NBA</TabsTrigger>
            <TabsTrigger value="nfl">NFL</TabsTrigger>
            <TabsTrigger value="mlb">MLB</TabsTrigger>
            <TabsTrigger value="soccer">Soccer</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            {sportFixtures[selectedSport].map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <a href={`/sports/${selectedSport}`} className="text-sm text-amber-500 hover:underline">
          View all {selectedSport.toUpperCase()} matches
        </a>
      </CardFooter>
    </Card>
  )
}

