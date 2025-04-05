"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { liveFixtures } from "@/lib/fixtures"

export function LiveMatches() {
  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Matches</CardTitle>
            <CardDescription>Bet on matches happening right now</CardDescription>
          </div>
          <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/20">
            LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {liveFixtures.map((match) => (
          <div key={match.id} className="border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-500">
                  LIVE • {match.currentTime}
                </div>
                <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                  {match.league}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{match.homeTeam}</span>
                  <span className="text-xs text-muted-foreground">{match.homeOdds} (live)</span>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold">
                    {match.homeScore} - {match.awayScore}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {match.league === "Soccer" ? match.currentTime : `Q${match.quarter} ${match.currentTime}`}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{match.awayTeam}</span>
                  <span className="text-xs text-muted-foreground">{match.awayOdds} (live)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-zinc-800 text-center">
              <button className="py-2 hover:bg-zinc-800 transition-colors">
                <div className="text-sm font-medium">{match.homeOdds}</div>
                <div className="text-xs text-muted-foreground">Home</div>
              </button>
              <button className="py-2 border-x border-zinc-800 hover:bg-zinc-800 transition-colors">
                <div className="text-sm font-medium">{match.drawOdds}</div>
                <div className="text-xs text-muted-foreground">Draw</div>
              </button>
              <button className="py-2 hover:bg-zinc-800 transition-colors">
                <div className="text-sm font-medium">{match.awayOdds}</div>
                <div className="text-xs text-muted-foreground">Away</div>
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

