import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedTicker } from "@/components/animated-ticker"
import { liveFixtures } from "@/lib/fixtures"
import { Eye, Zap } from "lucide-react"

export default function LivePage() {
  return (
    <div className="space-y-6">
      <AnimatedTicker />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Live Matches</h1>
        <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/20">
          LIVE NOW
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveFixtures.map((match) => (
          <Card key={match.id} className="overflow-hidden border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/20">
                  LIVE • {match.currentTime}
                </Badge>
                <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/20">
                  {match.league}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-start">
                  <span className="text-lg font-medium">{match.homeTeam}</span>
                  <span className="text-xs text-muted-foreground">{match.homeOdds} (live)</span>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {match.homeScore} - {match.awayScore}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {match.league === "Soccer" ? match.currentTime : `Q${match.quarter} ${match.currentTime}`}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-lg font-medium">{match.awayTeam}</span>
                  <span className="text-xs text-muted-foreground">{match.awayOdds} (live)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/live/${match.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Watch Live
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1 border-zinc-700">
                  <Zap className="h-4 w-4 mr-2 text-amber-500" />
                  Bet Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

