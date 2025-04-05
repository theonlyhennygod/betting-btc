"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap } from "lucide-react"
import { featuredBets } from "@/lib/fixtures"

export function FeaturedBets() {
  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardHeader>
        <CardTitle>Featured Bets</CardTitle>
        <CardDescription>Popular bets with enhanced odds</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="popular">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="boosted">Boosted Odds</TabsTrigger>
            <TabsTrigger value="specials">Specials</TabsTrigger>
          </TabsList>

          <TabsContent value="popular" className="space-y-4">
            {featuredBets.popular.map((bet) => (
              <div key={bet.id} className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{bet.title}</span>
                    {bet.boosted && (
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/20">
                        BOOSTED
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{bet.event}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">{bet.odds}</div>
                    <div className="text-xs text-muted-foreground">odds</div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Bet
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="boosted" className="space-y-4">
            {featuredBets.boosted.map((bet) => (
              <div key={bet.id} className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{bet.title}</span>
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/20">
                      BOOSTED
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{bet.event}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-xs line-through text-muted-foreground mr-1">{bet.originalOdds}</span>
                      <span className="text-sm font-medium text-amber-500">{bet.odds}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">odds</div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Bet
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="specials" className="space-y-4">
            {featuredBets.specials.map((bet) => (
              <div key={bet.id} className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{bet.title}</span>
                    {bet.special && (
                      <Badge variant="outline" className="bg-purple-500/20 text-purple-500 border-purple-500/20">
                        SPECIAL
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{bet.event}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">{bet.odds}</div>
                    <div className="text-xs text-muted-foreground">odds</div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Bet
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

