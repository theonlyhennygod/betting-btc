import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, Users, Zap } from "lucide-react"

// TODO: Fetch actual tournament data from an API
const tournamentData = [
  {
    id: "tourney-1",
    name: "Weekly High Roller",
    status: "Live",
    startDate: "Apr 4, 2024",
    endDate: "Apr 11, 2024",
    prizePool: 1000000,
    entryFee: 50000,
    participants: 45,
  },
  {
    id: "tourney-2",
    name: "NBA Playoffs Challenge",
    status: "Upcoming",
    startDate: "Apr 12, 2024",
    endDate: "Apr 25, 2024",
    prizePool: 500000,
    entryFee: 10000,
    participants: 128,
  },
  {
    id: "tourney-3",
    name: "Soccer Champions League",
    status: "Finished",
    startDate: "Mar 20, 2024",
    endDate: "Apr 3, 2024",
    prizePool: 750000,
    entryFee: 25000,
    participants: 88,
  },
]

export default function TournamentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Sparkles className="h-7 w-7 mr-2 text-amber-500" />
        Tournaments
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournamentData.map((tournament) => (
          <Card key={tournament.id} className="bg-black/40 border-zinc-800 flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{tournament.name}</CardTitle>
                <Badge
                  variant="outline"
                  className={`text-xs 
                    ${tournament.status === "Live" ? "bg-red-500/20 text-red-500 border-red-500/20" : tournament.status === "Upcoming" ? "bg-blue-500/20 text-blue-500 border-blue-500/20" : "bg-zinc-700/50 text-zinc-400 border-zinc-700"}`}
                >
                  {tournament.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center text-xs text-muted-foreground pt-1">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {tournament.startDate} - {tournament.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Prize Pool:</span>
                <span className="font-medium text-green-500">{tournament.prizePool.toLocaleString()} sats</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Entry Fee:</span>
                <span className="font-medium">{tournament.entryFee.toLocaleString()} sats</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Participants:</span>
                <span className="font-medium flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {tournament.participants}
                </span>
              </div>
            </CardContent>
            <div className="p-4 pt-0 mt-auto">
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                disabled={tournament.status !== "Upcoming"} // Example: Disable if not upcoming
              >
                <Zap className="h-4 w-4 mr-2" />
                {tournament.status === "Upcoming" ? "Enter Tournament" : "View Details"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 