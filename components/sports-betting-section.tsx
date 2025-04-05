"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MatchCard } from "@/components/match-card"
import { sportFixtures } from "@/lib/fixtures"
import { Zap, TrendingUp, Star } from "lucide-react"

interface SportsBettingSectionProps {
  filter?: "today" | "tomorrow" | "futures"
}

export function SportsBettingSection({ filter }: SportsBettingSectionProps) {
  const [selectedSport, setSelectedSport] = useState("nba")
  const [filteredFixtures, setFilteredFixtures] = useState(sportFixtures[selectedSport])

  useEffect(() => {
    // Apply filters based on the filter prop
    if (filter) {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const filtered = sportFixtures[selectedSport].filter((match) => {
        const matchDate = new Date(match.startTime)

        if (filter === "today") {
          return matchDate.toDateString() === now.toDateString()
        } else if (filter === "tomorrow") {
          return matchDate.toDateString() === tomorrow.toDateString()
        } else if (filter === "futures") {
          // Futures are matches more than 7 days away
          const futureDate = new Date(now)
          futureDate.setDate(futureDate.getDate() + 7)
          return matchDate > futureDate
        }

        return true
      })

      setFilteredFixtures(filtered)
    } else {
      setFilteredFixtures(sportFixtures[selectedSport])
    }
  }, [selectedSport, filter])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-black/40 border-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Popular Bets</CardTitle>
                <CardDescription>Most popular bets right now</CardDescription>
              </div>
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Trending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                <div>
                  <div className="text-sm font-medium">Lakers to win vs Celtics</div>
                  <div className="text-xs text-muted-foreground">NBA • Today 7:00 PM</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-amber-500">1.95</div>
                  <Button size="sm" className="h-8">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Bet
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                <div>
                  <div className="text-sm font-medium">Chiefs -3.5 vs Ravens</div>
                  <div className="text-xs text-muted-foreground">NFL • Tomorrow 8:00 PM</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-amber-500">1.90</div>
                  <Button size="sm" className="h-8">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Bet
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                <div>
                  <div className="text-sm font-medium">Barcelona & Liverpool both to win</div>
                  <div className="text-xs text-muted-foreground">Soccer • Multiple Events</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-amber-500">4.50</div>
                  <Button size="sm" className="h-8">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Bet
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Boosted Odds</CardTitle>
                <CardDescription>Special enhanced odds</CardDescription>
              </div>
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">
                <Star className="h-3.5 w-3.5 mr-1" />
                Boosted
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                <div>
                  <div className="text-sm font-medium">LeBron James to score 30+ points</div>
                  <div className="text-xs text-muted-foreground">NBA • Lakers vs Celtics</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs line-through text-muted-foreground mr-1">2.80</div>
                  <div className="text-sm font-medium text-amber-500">3.50</div>
                  <Button size="sm" className="h-8">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Bet
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                <div>
                  <div className="text-sm font-medium">Barcelona to win & both teams to score</div>
                  <div className="text-xs text-muted-foreground">Soccer • Barcelona vs Real Madrid</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs line-through text-muted-foreground mr-1">3.20</div>
                  <div className="text-sm font-medium text-amber-500">4.00</div>
                  <Button size="sm" className="h-8">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Bet
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                <div>
                  <div className="text-sm font-medium">Chiefs, Eagles & 49ers all to win</div>
                  <div className="text-xs text-muted-foreground">NFL • Multiple Events</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs line-through text-muted-foreground mr-1">5.00</div>
                  <div className="text-sm font-medium text-amber-500">6.50</div>
                  <Button size="sm" className="h-8">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Bet
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              {filteredFixtures.length > 0 ? (
                filteredFixtures.map((match) => <MatchCard key={match.id} match={match} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">No matches found for the selected filter</div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

