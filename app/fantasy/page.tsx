import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FantasyLeagues } from "@/components/fantasy-leagues"
import { FantasyContests } from "@/components/fantasy-contests"
import { FantasyLeaderboard } from "@/components/fantasy-leaderboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Trophy, Users, Zap } from "lucide-react"

export default function FantasyPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fantasy Sports</h1>
          <p className="text-muted-foreground">Create teams, join contests, win sats</p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
        >
          <Link href="/fantasy/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New Team
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-black/40 border-zinc-800">
          <CardHeader>
            <CardTitle>Featured Contests</CardTitle>
            <CardDescription>Join these contests to win big</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                >
                  <div>
                    <div className="font-medium">
                      {i === 1 ? "NBA All-Stars" : i === 2 ? "Premier League Weekly" : "NFL Sunday Showdown"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {i === 1 ? "Ends in 2 days" : i === 2 ? "Ends in 16 hours" : "Starts in 3 days"}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-amber-500 font-medium">
                        <Zap className="inline h-3 w-3 mr-1" />
                        {i === 1 ? "1,000,000" : i === 2 ? "500,000" : "2,000,000"} sats
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <Users className="inline h-3 w-3 mr-1" />
                        {i === 1 ? "1,245" : i === 2 ? "876" : "532"} entries
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/fantasy/contests/${i}`}>Enter</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-zinc-800">
          <CardHeader>
            <CardTitle>Your Teams</CardTitle>
            <CardDescription>Manage your fantasy teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                <div className="font-medium">Dream Team</div>
                <div className="text-sm text-muted-foreground">NBA • 5 players</div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm">
                    <Trophy className="inline h-3 w-3 mr-1 text-amber-500" />
                    <span className="text-amber-500">245.8 pts</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-zinc-700" asChild>
                    <Link href="/fantasy/teams/1">Manage</Link>
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                <div className="font-medium">Lightning XI</div>
                <div className="text-sm text-muted-foreground">Soccer • 11 players</div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm">
                    <Trophy className="inline h-3 w-3 mr-1 text-amber-500" />
                    <span className="text-amber-500">178.2 pts</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-zinc-700" asChild>
                    <Link href="/fantasy/teams/2">Manage</Link>
                  </Button>
                </div>
              </div>

              <Button className="w-full" variant="outline" asChild>
                <Link href="/fantasy/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Team
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contests">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contests">Contests</TabsTrigger>
          <TabsTrigger value="leagues">Leagues</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="contests" className="mt-4">
          <FantasyContests />
        </TabsContent>
        <TabsContent value="leagues" className="mt-4">
          <FantasyLeagues />
        </TabsContent>
        <TabsContent value="leaderboard" className="mt-4">
          <FantasyLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

