"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Check, Zap } from "lucide-react"

interface Player {
  id: string
  name: string
  team: string
  position: string
  price: number
  projectedPoints: number
  image?: string
}

interface FantasyPlayerSelectorProps {
  sport: string
  selectedPlayers: string[]
  onSelectPlayer: (playerId: string) => void
}

export function FantasyPlayerSelector({ sport, selectedPlayers, onSelectPlayer }: FantasyPlayerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("all")
  const [players, setPlayers] = useState<Player[]>([])

  // Generate players based on sport
  useEffect(() => {
    const generatedPlayers: Player[] = []

    // Number of players to generate
    const numPlayers = 50

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

    // Generate players
    for (let i = 0; i < numPlayers; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const name = `${firstName} ${lastName}`
      const position = positions[sport][Math.floor(Math.random() * positions[sport].length)]
      const team = teams[sport][Math.floor(Math.random() * teams[sport].length)]
      const price = Math.floor(Math.random() * 15000) + 5000
      const projectedPoints = Math.floor(Math.random() * 200) + 50

      generatedPlayers.push({
        id: `player-${sport}-${i}`,
        name,
        team,
        position,
        price,
        projectedPoints: projectedPoints / 10,
      })
    }

    setPlayers(generatedPlayers)
  }, [sport])

  // Filter players based on search query and position
  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPosition = selectedPosition === "all" || player.position === selectedPosition

    return matchesSearch && matchesPosition
  })

  // Get unique positions for the current sport
  const uniquePositions = Array.from(new Set(players.map((player) => player.position)))

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-zinc-800 border-zinc-700"
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedPosition}>
        <TabsList className="flex w-full overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {uniquePositions.map((position) => (
            <TabsTrigger key={position} value={position}>
              {position}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{selectedPlayers.length} players selected</span>
        <span>{filteredPlayers.length} players found</span>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {filteredPlayers.map((player) => {
            const isSelected = selectedPlayers.includes(player.id)

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                  isSelected ? "border-amber-500/50 bg-amber-500/5" : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Image
                      src={player.image || `/placeholder.svg?height=40&width=40`}
                      alt={player.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Badge variant="outline" className="mr-2 h-5 px-1.5 text-xs bg-zinc-800 hover:bg-zinc-800">
                        {player.position}
                      </Badge>
                      {player.team}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-amber-500">
                      <Zap className="inline h-3 w-3 mr-0.5" />
                      {player.price.toLocaleString()} sats
                    </div>
                    <div className="text-xs text-muted-foreground">{player.projectedPoints.toFixed(1)} pts</div>
                  </div>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="icon"
                    className={`h-7 w-7 ${isSelected ? "bg-amber-500 hover:bg-amber-600" : "border-zinc-700"}`}
                    onClick={() => onSelectPlayer(player.id)}
                  >
                    {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    <span className="sr-only">{isSelected ? "Remove player" : "Add player"}</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

