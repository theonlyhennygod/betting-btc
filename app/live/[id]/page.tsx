import { LiveMatchDetails } from "@/components/live-match-details"
import { LiveChat } from "@/components/live-chat"
import { LiveBetting } from "@/components/live-betting"
import { liveFixtures } from "@/lib/fixtures"
import { notFound } from "next/navigation"

interface LiveMatchPageProps {
  params: {
    id: string
  }
}

export default function LiveMatchPage({ params }: LiveMatchPageProps) {
  const matchId = params.id
  const match = liveFixtures.find((m) => m.id === matchId)

  if (!match) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {match.homeTeam} vs {match.awayTeam}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LiveMatchDetails match={match} />
        </div>

        <div className="space-y-6">
          <LiveBetting match={match} />
          <LiveChat matchId={matchId} />
        </div>
      </div>
    </div>
  )
}

