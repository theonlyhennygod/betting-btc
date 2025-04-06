import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

// TODO: Fetch actual leaderboard data from an API
const leaderboardData = [
  { rank: 1, user: "Satoshi", winnings: 500000, bets: 150 },
  { rank: 2, user: "LightningLover", winnings: 350000, bets: 120 },
  { rank: 3, user: "BetMasterBTC", winnings: 280000, bets: 100 },
  { rank: 4, user: "WhaleWatcher", winnings: 210000, bets: 85 },
  { rank: 5, user: "PlebPower", winnings: 150000, bets: 95 },
  { rank: 6, user: "HodlerHitter", winnings: 120000, bets: 70 },
  { rank: 7, user: "DiamondHandsDave", winnings: 95000, bets: 60 },
  { rank: 8, user: "RektNoMore", winnings: 70000, bets: 55 },
  { rank: 9, user: "MoonKid", winnings: 55000, bets: 40 },
  { rank: 10, user: "StackingSatsSam", winnings: 40000, bets: 30 },
];

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Trophy className="h-7 w-7 mr-2 text-amber-500" />
        Leaderboard
      </h1>

      <Card className="bg-black/40 border-zinc-800">
        <CardHeader>
          <CardTitle>Top Bettors</CardTitle>
          <CardDescription>See who is leading the pack in total winnings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Total Winnings (sats)</TableHead>
                <TableHead className="text-right">Bets Won</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry) => (
                <TableRow key={entry.rank} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-medium">
                    {entry.rank === 1 && <Badge className="mr-2 bg-amber-500/20 text-amber-500">🥇</Badge>}
                    {entry.rank === 2 && <Badge className="mr-2 bg-zinc-400/20 text-zinc-400">🥈</Badge>}
                    {entry.rank === 3 && <Badge className="mr-2 bg-orange-700/20 text-orange-600">🥉</Badge>}
                    {entry.rank}
                  </TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell className="text-right text-green-500 font-medium">{entry.winnings.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{entry.bets}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 