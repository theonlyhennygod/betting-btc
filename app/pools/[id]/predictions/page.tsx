"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Check, Clock, Trophy } from "lucide-react"
import Link from "next/link"

interface PredictionsPageProps {
  params: {
    id: string
  }
}

export default function PredictionsPage({ params }: PredictionsPageProps) {
  const poolId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [predictions, setPredictions] = useState<Record<string, string>>({})
  const [tiebreaker, setTiebreaker] = useState("")

  // Mock pool data
  const pool = {
    id: poolId,
    name: "NBA Playoff Winners",
    description: "Pick the winners of all NBA playoff games",
    entryFee: 50000,
    prizePool: 5000000,
    entries: 87,
    maxEntries: 1000,
    endsAt: "2025-04-15T23:59:59Z",
    type: "pick-em",
    sport: "NBA",
    icon: "🏀",
    matches: [
      { id: "m1", homeTeam: "Lakers", awayTeam: "Nuggets", startTime: "2025-04-15T19:00:00Z" },
      { id: "m2", homeTeam: "Celtics", awayTeam: "76ers", startTime: "2025-04-15T21:30:00Z" },
      { id: "m3", homeTeam: "Bucks", awayTeam: "Heat", startTime: "2025-04-16T18:00:00Z" },
      { id: "m4", homeTeam: "Warriors", awayTeam: "Suns", startTime: "2025-04-16T20:30:00Z" },
    ],
    tiebreakerQuestion: "Total points in Lakers vs Nuggets game",
  }

  const handlePredictionChange = (matchId: string, team: string) => {
    setPredictions({
      ...predictions,
      [matchId]: team,
    })
  }

  const handleSubmitPredictions = () => {
    // Validate all predictions are made
    if (Object.keys(predictions).length < pool.matches.length) {
      toast({
        variant: "destructive",
        title: "Incomplete predictions",
        description: "Please make a prediction for all matches",
      })
      return
    }

    if (!tiebreaker) {
      toast({
        variant: "destructive",
        title: "Tiebreaker required",
        description: "Please answer the tiebreaker question",
      })
      return
    }

    setIsSaving(true)

    // Simulate saving predictions
    setTimeout(() => {
      toast({
        title: "Predictions saved!",
        description: "Your predictions have been submitted successfully",
      })

      router.push(`/pools/${poolId}`)
    }, 1500)
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
          <Link href={`/pools/${poolId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-2xl">{pool.icon}</span>
            {pool.name}
          </h1>
          <p className="text-muted-foreground">Make your predictions</p>
        </div>
      </div>

      <Card className="bg-black/40 border-zinc-800">
        <CardHeader>
          <CardTitle>Your Predictions</CardTitle>
          <CardDescription>Pick the winners for each match</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {pool.matches.map((match) => (
            <div key={match.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  {match.homeTeam} vs {match.awayTeam}
                </h3>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {formatDate(match.startTime)}
                </div>
              </div>

              <RadioGroup
                value={predictions[match.id] || ""}
                onValueChange={(value) => handlePredictionChange(match.id, value)}
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={match.homeTeam} id={`${match.id}-home`} />
                      <Label htmlFor={`${match.id}-home`} className="cursor-pointer">
                        {match.homeTeam} (Home)
                      </Label>
                    </div>
                    {predictions[match.id] === match.homeTeam && <Check className="h-4 w-4 text-amber-500" />}
                  </div>

                  <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={match.awayTeam} id={`${match.id}-away`} />
                      <Label htmlFor={`${match.id}-away`} className="cursor-pointer">
                        {match.awayTeam} (Away)
                      </Label>
                    </div>
                    {predictions[match.id] === match.awayTeam && <Check className="h-4 w-4 text-amber-500" />}
                  </div>
                </div>
              </RadioGroup>

              <Separator className="bg-zinc-800 my-4" />
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="tiebreaker">Tiebreaker: {pool.tiebreakerQuestion}</Label>
            <Input
              id="tiebreaker"
              type="number"
              placeholder="Enter your prediction"
              value={tiebreaker}
              onChange={(e) => setTiebreaker(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="border-zinc-700" asChild>
            <Link href={`/pools/${poolId}`}>Cancel</Link>
          </Button>
          <Button
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            onClick={handleSubmitPredictions}
            disabled={isSaving}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Trophy className="mr-2 h-4 w-4" />
                Submit Predictions
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

