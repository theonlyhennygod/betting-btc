import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpcomingMatches } from "@/components/upcoming-matches"
import { LiveMatches } from "@/components/live-matches"
import { FeaturedBets } from "@/components/featured-bets"
import { HeroSection } from "@/components/hero-section"
import { BettingPools } from "@/components/betting-pools"
import { FantasyTeamBuilder } from "@/components/fantasy-team-builder"
import { TheSportsDbEvents } from "@/components/the-sports-db-events"

export default function Home() {
  return (
    <div className="space-y-8">
      <HeroSection />

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="fantasy">Fantasy</TabsTrigger>
          <TabsTrigger value="pools">Pools</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          <UpcomingMatches />
          <TheSportsDbEvents />
        </TabsContent>
        <TabsContent value="live" className="space-y-4 mt-4">
          <LiveMatches />
        </TabsContent>
        <TabsContent value="fantasy" className="space-y-4 mt-4">
          <FantasyTeamBuilder />
        </TabsContent>
        <TabsContent value="pools" className="space-y-4 mt-4">
          <BettingPools />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FeaturedBets />
        </div>
        <div>
          <Card className="bg-black/40 border-zinc-800">
            <CardHeader>
              <CardTitle>Why Bit Bet?</CardTitle>
              <CardDescription>Bitcoin-native sports betting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-500"
                  >
                    <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
                    <path d="m13 12-3 5h4l-1 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant deposits and withdrawals via Lightning Network
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-500"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Non-Custodial</h3>
                  <p className="text-sm text-muted-foreground">
                    We never hold your funds - bet directly from your wallet
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-500"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Privacy First</h3>
                  <p className="text-sm text-muted-foreground">No KYC, no accounts - just LNURL-auth and betting</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                Learn More
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

