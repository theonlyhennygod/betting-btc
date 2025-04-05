import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SportsHeader } from "@/components/sports-header"
import { SportLeagueSelector } from "@/components/sport-league-selector"
import { MatchCard } from "@/components/match-card"
import { FeaturedBets } from "@/components/featured-bets"
import { BettingGuide } from "@/components/betting-guide"
import { sportFixtures } from "@/lib/fixtures"
import { notFound } from "next/navigation"

interface SportPageProps {
  params: {
    sport: string
  }
}

export default function SportPage({ params }: SportPageProps) {
  const sport = params.sport

  // Check if sport exists in fixtures
  if (!sportFixtures[sport] && !["tennis", "golf", "ufc", "other"].includes(sport)) {
    notFound()
  }

  // Get sport display name
  const getSportName = () => {
    switch (sport) {
      case "nba":
        return "NBA Basketball"
      case "nfl":
        return "NFL Football"
      case "mlb":
        return "MLB Baseball"
      case "soccer":
        return "Soccer"
      case "tennis":
        return "Tennis"
      case "golf":
        return "Golf"
      case "ufc":
        return "UFC/MMA"
      case "other":
        return "Other Sports"
      default:
        return sport.toUpperCase()
    }
  }

  // For sports not in fixtures, show a placeholder
  const fixtures = sportFixtures[sport] || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{getSportName()}</h1>

      <SportsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {["tennis", "golf", "ufc", "other"].includes(sport) ? (
            <div className="bg-black/40 border border-zinc-800 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                Betting for {getSportName()} will be available soon. Check back later!
              </p>
            </div>
          ) : (
            <>
              <SportLeagueSelector sport={sport} />

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                  <TabsTrigger value="futures">Futures</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4 mt-4">
                  {fixtures.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </TabsContent>
                <TabsContent value="today" className="space-y-4 mt-4">
                  {fixtures
                    .filter((match) => {
                      const matchDate = new Date(match.startTime)
                      const today = new Date()
                      return matchDate.toDateString() === today.toDateString()
                    })
                    .map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                </TabsContent>
                <TabsContent value="tomorrow" className="space-y-4 mt-4">
                  {fixtures
                    .filter((match) => {
                      const matchDate = new Date(match.startTime)
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      return matchDate.toDateString() === tomorrow.toDateString()
                    })
                    .map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                </TabsContent>
                <TabsContent value="futures" className="space-y-4 mt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    No futures markets available at this time
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>

        <div className="space-y-6">
          <FeaturedBets />
          <BettingGuide />
        </div>
      </div>
    </div>
  )
}

