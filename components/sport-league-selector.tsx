"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SportLeagueSelectorProps {
  sport: string
}

export function SportLeagueSelector({ sport }: SportLeagueSelectorProps) {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null)

  // Define leagues based on sport
  const getLeagues = () => {
    switch (sport) {
      case "nba":
        return [
          { id: "regular", name: "Regular Season" },
          { id: "playoffs", name: "Playoffs" },
          { id: "finals", name: "Finals" },
        ]
      case "nfl":
        return [
          { id: "regular", name: "Regular Season" },
          { id: "playoffs", name: "Playoffs" },
          { id: "superbowl", name: "Super Bowl" },
        ]
      case "mlb":
        return [
          { id: "regular", name: "Regular Season" },
          { id: "playoffs", name: "Playoffs" },
          { id: "worldseries", name: "World Series" },
        ]
      case "soccer":
        return [
          { id: "premier", name: "Premier League" },
          { id: "laliga", name: "La Liga" },
          { id: "bundesliga", name: "Bundesliga" },
          { id: "seriea", name: "Serie A" },
          { id: "ligue1", name: "Ligue 1" },
          { id: "champions", name: "Champions League" },
        ]
      default:
        return []
    }
  }

  const leagues = getLeagues()

  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedLeague === null ? "default" : "outline"}
            size="sm"
            className={
              selectedLeague === null
                ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                : "border-zinc-700"
            }
            onClick={() => setSelectedLeague(null)}
          >
            All Leagues
          </Button>

          {leagues.map((league) => (
            <Button
              key={league.id}
              variant={selectedLeague === league.id ? "default" : "outline"}
              size="sm"
              className={
                selectedLeague === league.id
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  : "border-zinc-700"
              }
              onClick={() => setSelectedLeague(league.id)}
            >
              {league.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

