"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Zap } from "lucide-react"

export function FantasyLeaderboard() {
  const [timeframe, setTimeframe] = useState("weekly")
  const [sport, setSport] = useState("all")

  // Mock leaderboard data
  const leaderboardData = {
    weekly: [
      { rank: 1, username: "SatoshiSam", points: 342.5, winnings: 500000, avatar: "S" },
      { rank: 2, username: "LightningLucy", points: 328.7, winnings: 250000, avatar: "L" },
      { rank: 3, username: "BitcoinBob", points: 315.2, winnings: 150000, avatar: "B" },
      { rank: 4, username: "NodeRunner", points: 302.8, winnings: 75000, avatar: "N" },
      { rank: 5, username: "TaprootTom", points: 298.3, winnings: 75000, avatar: "T" },
      { rank: 6, username: "BlockchainBill", points: 287.1, winnings: 50000, avatar: "B" },
      { rank: 7, username: "HashratePete", points: 276.9, winnings: 50000, avatar: "H" },
      { rank: 8, username: "LNBettor", points: 265.4, winnings: 25000, avatar: "L" },
      { rank: 9, username: "SatsStacker", points: 254.2, winnings: 25000, avatar: "S" },
      { rank: 10, username: "You", points: 248.7, winnings: 25000, avatar: "Y", isCurrentUser: true },
    ],
    monthly: [
      { rank: 1, username: "LightningLucy", points: 1245.8, winnings: 2000000, avatar: "L" },
      { rank: 2, username: "BitcoinBob", points: 1187.3, winnings: 1000000, avatar: "B" },
      { rank: 3, username: "SatoshiSam", points: 1156.2, winnings: 500000, avatar: "S" },
      { rank: 4, username: "BlockchainBill", points: 1098.5, winnings: 250000, avatar: "B" },
      { rank: 5, username: "NodeRunner", points: 1067.9, winnings: 250000, avatar: "N" },
      { rank: 6, username: "TaprootTom", points: 1023.4, winnings: 100000, avatar: "T" },
      { rank: 7, username: "You", points: 987.6, winnings: 100000, avatar: "Y", isCurrentUser: true },
      { rank: 8, username: "HashratePete", points: 954.2, winnings: 50000, avatar: "H" },
      { rank: 9, username: "LNBettor", points: 932.8, winnings: 50000, avatar: "L" },
      { rank: 10, username: "SatsStacker", points: 912.3, winnings: 50000, avatar: "S" },
    ],
    allTime: [
      { rank: 1, username: "BitcoinBob", points: 12567.8, winnings: 10000000, avatar: "B" },
      { rank: 2, username: "LightningLucy", points: 11982.3, winnings: 7500000, avatar: "L" },
      { rank: 3, username: "SatoshiSam", points: 11456.7, winnings: 5000000, avatar: "S" },
      { rank: 4, username: "NodeRunner", points: 10876.5, winnings: 2500000, avatar: "N" },
      { rank: 5, username: "BlockchainBill", points: 10234.9, winnings: 1000000, avatar: "B" },
      { rank: 6, username: "TaprootTom", points: 9876.3, winnings: 750000, avatar: "T" },
      { rank: 7, username: "HashratePete", points: 9543.2, winnings: 500000, avatar: "H" },
      { rank: 8, username: "LNBettor", points: 9234.8, winnings: 250000, avatar: "L" },
      { rank: 9, username: "SatsStacker", points: 8765.4, winnings: 100000, avatar: "S" },
      { rank: 10, username: "You", points: 8432.1, winnings: 100000, avatar: "Y", isCurrentUser: true },
    ],
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs defaultValue="weekly" onValueChange={setTimeframe} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={sport} onValueChange={setSport}>
          <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700">
            <SelectValue placeholder="Filter by sport" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="nba">NBA Basketball</SelectItem>
            <SelectItem value="nfl">NFL Football</SelectItem>
            <SelectItem value="mlb">MLB Baseball</SelectItem>
            <SelectItem value="soccer">Soccer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-black/40 border-zinc-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium">Rank</th>
                  <th className="text-left p-4 text-sm font-medium">User</th>
                  <th className="text-right p-4 text-sm font-medium">Points</th>
                  <th className="text-right p-4 text-sm font-medium">Winnings</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData[timeframe as keyof typeof leaderboardData].map((user) => (
                  <tr
                    key={user.rank}
                    className={`border-b border-zinc-800 ${user.isCurrentUser ? "bg-amber-500/5" : "hover:bg-zinc-800/50"} transition-colors`}
                  >
                    <td className="p-4">
                      {user.rank <= 3 ? (
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            user.rank === 1
                              ? "bg-amber-500 text-black"
                              : user.rank === 2
                                ? "bg-zinc-400 text-black"
                                : "bg-amber-800 text-white"
                          }`}
                        >
                          {user.rank}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">{user.rank}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={user.isCurrentUser ? "bg-amber-500/20 text-amber-500" : "bg-zinc-800"}
                          >
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className={user.isCurrentUser ? "font-medium" : ""}>{user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end">
                        <Trophy className="h-3.5 w-3.5 text-amber-500 mr-1" />
                        <span>{user.points.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end">
                        <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                        <span>{user.winnings.toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

