"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trophy, Zap } from "lucide-react"

interface Player {
  id: string
  name: string
  team: string
  position: string
  price: number
  projectedPoints: number
  image?: string
}

interface FantasyTeamPreviewProps {
  teamName: string
  sport: string
  selectedPlayers: string[]
}

export function FantasyTeamPreview({ teamName, sport, selectedPlayers }: FantasyTeamPreviewProps) {
  const [players, setPlayers] = useState<Player[]>([])

  // Generate players based on selected IDs
  useEffect(() => {
    const generatedPlayers: Player[] = []

    // Positions based on sport
    const positions: Record<string, string[]> = {
      nba: ["PG", "SG", "SF", "PF", "C"],
      nfl: ["QB", "RB", "WR", "TE", "K", "DEF"],
      mlb: ["P", "C", "1B", "2B", "3B", "SS", "OF"],
      soccer: ["GK", "DEF", "MID", "FWD"],
    }

    // Teams based on sport
    const teams: Record<string, string[]> = {
      nba: ["Lakers", "Celtics", "Warriors", "Bucks", "Heat", "Nets", "76ers", "Suns"],
      nfl: ["Chiefs", "Eagles", "49ers", "Bills", "Cowboys", "Ravens", "Bengals", "Packers"],
      mlb: ["Yankees", "Dodgers", "Red Sox", "Cubs", "Braves", "Astros", "Cardinals", "Giants"],
      soccer: ["Arsenal", "Chelsea", "Liverpool", "Man City", "Barcelona", "Real Madrid", "Bayern", "PSG"],
    }

    // First names and last names for player generation
    const firstNames = [
      "James",
      "Michael",
      "John",
      "David",
      "Robert",
      "Kevin",
      "Chris",
      "Anthony",
      "Stephen",
      "Luka",
      "Giannis",
      "Joel",
      "Nikola",
      "LeBron",
      "Kawhi",
      "Jayson",
      "Damian",
      "Kyrie",
      "Trae",
      "Zion",
    ]
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Davis",
      "Miller",
      "Wilson",
      "Moore",
      "Taylor",
      "Anderson",
      "Thomas",
      "Jackson",
      "White",
      "Harris",
      "Martin",
      "Thompson",
      "Young",
      "Allen",
      "King",
    ]

    // Generate players for selected IDs
    selectedPlayers.forEach((playerId, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const name = `${firstName} ${lastName}`
      const position = positions[sport][index % positions[sport].length]
      const team = teams[sport][Math.floor(Math.random() * teams[sport].length)]
      const price = Math.floor(Math.random() * 15000) + 5000
      const projectedPoints = Math.floor(Math.random() * 200) + 50

      generatedPlayers.push({
        id: playerId,
        name,
        team,
        position,
        price,
        projectedPoints: projectedPoints / 10,
      })
    })

    setPlayers(generatedPlayers)
  }, [sport, selectedPlayers])

  // Calculate total cost and projected points
  const totalCost = players.reduce((sum, player) => sum + player.price, 0)
  const totalProjectedPoints = players.reduce((sum, player) => sum + player.projectedPoints, 0)

  // Group players by position
  const playersByPosition: Record<string, Player[]> = {}
  players.forEach((player) => {
    if (!playersByPosition[player.position]) {
      playersByPosition[player.position] = []
    }
    playersByPosition[player.position].push(player)
  })

  // Sort positions based on sport
  const sortedPositions = Object.keys(playersByPosition).sort((a, b) => {
    const positionOrder: Record<string, Record<string, number>> = {
      nba: { PG: 1, SG: 2, SF: 3, PF: 4, C: 5 },
      nfl: { QB: 1, RB: 2, WR: 3, TE: 4, K: 5, DEF: 6 },
      mlb: { P: 1, C: 2, "1B": 3, "2B": 4, "3B": 5, SS: 6, OF: 7 },
      soccer: { GK: 1, DEF: 2, MID: 3, FWD: 4 },
    }

    return (positionOrder[sport]?.[a] || 99) - (positionOrder[sport]?.[b] || 99)
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{teamName}</h3>
          <p className="text-sm text-muted-foreground">
            {players.length} players • {getSportName(sport)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-amber-500">
              <Zap className="inline h-3 w-3 mr-0.5" />
              {totalCost.toLocaleString()} sats
            </div>
            <div className="text-sm">
              <Trophy className="inline h-3 w-3 mr-0.5 text-amber-500" />
              {totalProjectedPoints.toFixed(1)} pts
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      <div className="space-y-4">
        {sortedPositions.map((position) => (
          <div key={position}>
            <h4 className="text-sm font-medium mb-2">{position}</h4>
            <div className="space-y-2">
              {playersByPosition[position].map((player) => (
                <Card key={player.id} className="bg-zinc-800/30 border-zinc-800">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                          <Image
                            src={player.image || `/placeholder.svg?height=32&width=32`}
                            alt={player.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">{player.team}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-amber-500">
                          <Zap className="inline h-3 w-3 mr-0.5" />
                          {player.price.toLocaleString()} sats
                        </div>
                        <div className="text-xs text-muted-foreground">{player.projectedPoints.toFixed(1)} pts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to get sport name
function getSportName(sport: string): string {
  switch (sport) {
    case "nba":
      return "NBA Basketball"
    case "nfl":
      return "NFL Football"
    case "mlb":
      return "MLB Baseball"
    case "soccer":
      return "Soccer"
    default:
      return "Sports"
  }
}

