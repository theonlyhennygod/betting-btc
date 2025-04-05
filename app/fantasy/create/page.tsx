"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { FantasyPlayerSelector } from "@/components/fantasy-player-selector"
import { FantasyTeamPreview } from "@/components/fantasy-team-preview"
import { ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"

export default function CreateFantasyTeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [teamName, setTeamName] = useState("")
  const [sport, setSport] = useState("nba")
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const handleNext = () => {
    if (step === 1) {
      if (!teamName) {
        toast({
          variant: "destructive",
          title: "Team name required",
          description: "Please enter a name for your fantasy team",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (selectedPlayers.length < getMinPlayers()) {
        toast({
          variant: "destructive",
          title: "Not enough players",
          description: `You need at least ${getMinPlayers()} players for a ${getSportName()} team`,
        })
        return
      }
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleCreateTeam = () => {
    setIsCreating(true)

    // Simulate team creation
    setTimeout(() => {
      toast({
        title: "Team created successfully!",
        description: `Your ${getSportName()} team "${teamName}" has been created`,
      })
      router.push("/fantasy")
    }, 1500)
  }

  const getMinPlayers = () => {
    switch (sport) {
      case "nba":
        return 5
      case "nfl":
        return 9
      case "mlb":
        return 9
      case "soccer":
        return 11
      default:
        return 5
    }
  }

  const getSportName = () => {
    switch (sport) {
      case "nba":
        return "NBA"
      case "nfl":
        return "NFL"
      case "mlb":
        return "MLB"
      case "soccer":
        return "Soccer"
      default:
        return "NBA"
    }
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
        <h1 className="text-2xl font-bold">Create Fantasy Team</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-400"}`}
          >
            1
          </div>
          <div className={`h-0.5 w-8 ${step >= 2 ? "bg-amber-500" : "bg-zinc-800"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-400"}`}
          >
            2
          </div>
          <div className={`h-0.5 w-8 ${step >= 3 ? "bg-amber-500" : "bg-zinc-800"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-400"}`}
          >
            3
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Step {step} of 3</div>
      </div>

      {step === 1 && (
        <Card className="bg-black/40 border-zinc-800">
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>Name your team and select a sport</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sport">Sport</Label>
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger id="sport" className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="nba">NBA Basketball</SelectItem>
                  <SelectItem value="nfl">NFL Football</SelectItem>
                  <SelectItem value="mlb">MLB Baseball</SelectItem>
                  <SelectItem value="soccer">Soccer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              onClick={handleNext}
            >
              Continue to Player Selection
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="bg-black/40 border-zinc-800">
          <CardHeader>
            <CardTitle>Select Players</CardTitle>
            <CardDescription>
              Choose at least {getMinPlayers()} players for your {getSportName()} team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FantasyPlayerSelector
              sport={sport}
              selectedPlayers={selectedPlayers}
              onSelectPlayer={(playerId) => {
                if (selectedPlayers.includes(playerId)) {
                  setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId))
                } else {
                  setSelectedPlayers([...selectedPlayers, playerId])
                }
              }}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack} className="border-zinc-700">
              Back
            </Button>
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              onClick={handleNext}
              disabled={selectedPlayers.length < getMinPlayers()}
            >
              Continue to Review
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card className="bg-black/40 border-zinc-800">
          <CardHeader>
            <CardTitle>Review Your Team</CardTitle>
            <CardDescription>
              Confirm your {getSportName()} team "{teamName}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FantasyTeamPreview teamName={teamName} sport={sport} selectedPlayers={selectedPlayers} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack} className="border-zinc-700">
              Back
            </Button>
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              onClick={handleCreateTeam}
              disabled={isCreating}
            >
              {isCreating ? (
                "Creating Team..."
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Create Team
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

