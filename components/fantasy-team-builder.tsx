"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { DollarSign, Plus, Trash2, Trophy, Zap } from "lucide-react"
import { fantasyPlayers } from "@/lib/fixtures"

interface Player {
  id: string
  name: string
  team: string
  position: string
  price: number
  projectedPoints: number
  selected: boolean
}

export function FantasyTeamBuilder() {
  const { toast } = useToast()
  const [players, setPlayers] = useState<Player[]>(fantasyPlayers.map((player) => ({ ...player, selected: false })))
  const [teamName, setTeamName] = useState("")
  const [betAmount, setBetAmount] = useState("50000")
  const [selectedPosition, setSelectedPosition] = useState("all")

  const selectedPlayers = players.filter((p) => p.selected)
  const totalCost = selectedPlayers.reduce((acc, curr) => acc + curr.price, 0)
  const totalProjectedPoints = selectedPlayers.reduce((acc, curr) => acc + curr.projectedPoints, 0)
  const budget = 100000
  const remainingBudget = budget - totalCost

  const filteredPlayers = selectedPosition === "all" ? players : players.filter((p) => p.position === selectedPosition)

  const handleTogglePlayer = (id: string) => {
    setPlayers((prev) => prev.map((player) => (player.id === id ? { ...player, selected: !player.selected } : player)))
  }

  const handleCreateTeam = () => {
    if (selectedPlayers.length < 5) {
      toast({
        variant: "destructive",
        title: "Not enough players",
        description: "Your fantasy team needs at least 5 players",
      })
      return
    }

    if (remainingBudget < 0) {
      toast({
        variant: "destructive",
        title: "Over budget",
        description: "Your team exceeds the maximum budget",
      })
      return
    }

    if (!teamName) {
      toast({
        variant: "destructive",
        title: "Team name required",
        description: "Please give your fantasy team a name",
      })
      return
    }

    toast({
      title: "Fantasy team created!",
      description: `${teamName} with ${selectedPlayers.length} players and ${totalProjectedPoints.toFixed(1)} projected points`,
    })
  }

  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardHeader>
        <CardTitle>Fantasy Team Builder</CardTitle>
        <CardDescription>Create your dream team and compete for sats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bet-amount">Entry Fee (sats)</Label>
              <div className="flex items-center">
                <Input
                  id="bet-amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
                <Zap className="h-4 w-4 text-amber-500 -ml-8" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Budget</div>
                <div className="flex items-center">
                  <DollarSign className="h-3.5 w-3.5 text-green-500 mr-1" />
                  <span className="font-medium">{budget.toLocaleString()} sats</span>
                </div>
              </div>

              <div className="bg-zinc-800/50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Remaining</div>
                <div className="flex items-center">
                  <DollarSign className="h-3.5 w-3.5 text-amber-500 mr-1" />
                  <span className={`font-medium ${remainingBudget < 0 ? "text-red-500" : ""}`}>
                    {remainingBudget.toLocaleString()} sats
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Projected Points</div>
              <div className="flex items-center">
                <Trophy className="h-3.5 w-3.5 text-amber-500 mr-1" />
                <span className="font-medium">{totalProjectedPoints.toFixed(1)} pts</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Selected Players ({selectedPlayers.length})</div>
              {selectedPlayers.length === 0 ? (
                <div className="text-xs text-muted-foreground p-3 border border-dashed border-zinc-800 rounded-lg text-center">
                  No players selected yet
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-zinc-800/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">{player.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {player.position} • {player.team}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-amber-500">{player.price.toLocaleString()} sats</div>
                          <div className="text-xs text-muted-foreground">{player.projectedPoints.toFixed(1)} pts</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-red-500/10 hover:text-red-500"
                          onClick={() => handleTogglePlayer(player.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Tabs defaultValue="all" onValueChange={setSelectedPosition}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="QB">QB</TabsTrigger>
                <TabsTrigger value="RB">RB</TabsTrigger>
                <TabsTrigger value="WR">WR</TabsTrigger>
                <TabsTrigger value="TE">TE</TabsTrigger>
              </TabsList>

              <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {filteredPlayers
                  .filter((p) => !p.selected)
                  .map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                          <Image src={`/placeholder.svg?height=40&width=40`} alt={player.name} width={24} height={24} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {player.position} • {player.team}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-amber-500">{player.price.toLocaleString()} sats</div>
                          <div className="text-xs text-muted-foreground">{player.projectedPoints.toFixed(1)} pts</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-amber-500/10 hover:text-amber-500"
                          onClick={() => handleTogglePlayer(player.id)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span className="sr-only">Add</span>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </Tabs>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          onClick={handleCreateTeam}
        >
          <Zap className="mr-2 h-4 w-4" />
          Create Fantasy Team
        </Button>
      </CardFooter>
    </Card>
  )
}

