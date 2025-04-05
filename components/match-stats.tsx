import type { Match } from "@/lib/types"

interface MatchStatsProps {
  match: Match
  homeScore: number
  awayScore: number
}

export function MatchStats({ match, homeScore, awayScore }: MatchStatsProps) {
  // Generate random stats based on the match type
  const isBasketball = match.league === "NBA"
  const isSoccer = match.league === "Soccer" || match.league === "EPL" || match.league === "LaLiga"
  const isFootball = match.league === "NFL"

  // Basketball stats
  const basketballStats = {
    fieldGoals: {
      home: `${Math.floor(Math.random() * 20) + 20}/${Math.floor(Math.random() * 20) + 40}`,
      away: `${Math.floor(Math.random() * 20) + 20}/${Math.floor(Math.random() * 20) + 40}`,
    },
    threePointers: {
      home: `${Math.floor(Math.random() * 10) + 5}/${Math.floor(Math.random() * 15) + 10}`,
      away: `${Math.floor(Math.random() * 10) + 5}/${Math.floor(Math.random() * 15) + 10}`,
    },
    freeThrows: {
      home: `${Math.floor(Math.random() * 10) + 5}/${Math.floor(Math.random() * 10) + 5}`,
      away: `${Math.floor(Math.random() * 10) + 5}/${Math.floor(Math.random() * 10) + 5}`,
    },
    rebounds: {
      home: Math.floor(Math.random() * 20) + 20,
      away: Math.floor(Math.random() * 20) + 20,
    },
    assists: {
      home: Math.floor(Math.random() * 15) + 10,
      away: Math.floor(Math.random() * 15) + 10,
    },
    steals: {
      home: Math.floor(Math.random() * 10) + 1,
      away: Math.floor(Math.random() * 10) + 1,
    },
    blocks: {
      home: Math.floor(Math.random() * 8) + 1,
      away: Math.floor(Math.random() * 8) + 1,
    },
    turnovers: {
      home: Math.floor(Math.random() * 15) + 5,
      away: Math.floor(Math.random() * 15) + 5,
    },
  }

  // Soccer stats
  const soccerStats = {
    possession: {
      home: Math.floor(Math.random() * 30) + 35,
      away: Math.floor(Math.random() * 30) + 35,
    },
    shots: {
      home: Math.floor(Math.random() * 15) + 5,
      away: Math.floor(Math.random() * 15) + 5,
    },
    shotsOnTarget: {
      home: Math.floor(Math.random() * 8) + 2,
      away: Math.floor(Math.random() * 8) + 2,
    },
    corners: {
      home: Math.floor(Math.random() * 8) + 1,
      away: Math.floor(Math.random() * 8) + 1,
    },
    fouls: {
      home: Math.floor(Math.random() * 10) + 5,
      away: Math.floor(Math.random() * 10) + 5,
    },
    yellowCards: {
      home: Math.floor(Math.random() * 4),
      away: Math.floor(Math.random() * 4),
    },
    redCards: {
      home: Math.floor(Math.random() * 2),
      away: Math.floor(Math.random() * 2),
    },
    offsides: {
      home: Math.floor(Math.random() * 5),
      away: Math.floor(Math.random() * 5),
    },
  }

  // Football stats
  const footballStats = {
    firstDowns: {
      home: Math.floor(Math.random() * 15) + 5,
      away: Math.floor(Math.random() * 15) + 5,
    },
    totalYards: {
      home: Math.floor(Math.random() * 200) + 100,
      away: Math.floor(Math.random() * 200) + 100,
    },
    passingYards: {
      home: Math.floor(Math.random() * 150) + 50,
      away: Math.floor(Math.random() * 150) + 50,
    },
    rushingYards: {
      home: Math.floor(Math.random() * 100) + 30,
      away: Math.floor(Math.random() * 100) + 30,
    },
    penalties: {
      home: `${Math.floor(Math.random() * 8) + 1}-${Math.floor(Math.random() * 50) + 10}`,
      away: `${Math.floor(Math.random() * 8) + 1}-${Math.floor(Math.random() * 50) + 10}`,
    },
    turnovers: {
      home: Math.floor(Math.random() * 4),
      away: Math.floor(Math.random() * 4),
    },
    timeOfPossession: {
      home: `${Math.floor(Math.random() * 20) + 10}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0")}`,
      away: `${Math.floor(Math.random() * 20) + 10}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0")}`,
    },
    thirdDownEff: {
      home: `${Math.floor(Math.random() * 8) + 1}/${Math.floor(Math.random() * 8) + 8}`,
      away: `${Math.floor(Math.random() * 8) + 1}/${Math.floor(Math.random() * 8) + 8}`,
    },
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-medium">{match.homeTeam}</div>
        <div className="text-2xl font-bold">
          {homeScore} - {awayScore}
        </div>
        <div className="text-lg font-medium">{match.awayTeam}</div>
      </div>

      <div className="space-y-2">
        {isBasketball && (
          <>
            <StatRow
              label="Field Goals"
              home={basketballStats.fieldGoals.home}
              away={basketballStats.fieldGoals.away}
            />
            <StatRow
              label="3-Pointers"
              home={basketballStats.threePointers.home}
              away={basketballStats.threePointers.away}
            />
            <StatRow
              label="Free Throws"
              home={basketballStats.freeThrows.home}
              away={basketballStats.freeThrows.away}
            />
            <StatRow label="Rebounds" home={basketballStats.rebounds.home} away={basketballStats.rebounds.away} />
            <StatRow label="Assists" home={basketballStats.assists.home} away={basketballStats.assists.away} />
            <StatRow label="Steals" home={basketballStats.steals.home} away={basketballStats.steals.away} />
            <StatRow label="Blocks" home={basketballStats.blocks.home} away={basketballStats.blocks.away} />
            <StatRow label="Turnovers" home={basketballStats.turnovers.home} away={basketballStats.turnovers.away} />
          </>
        )}

        {isSoccer && (
          <>
            <StatRow
              label="Possession"
              home={`${soccerStats.possession.home}%`}
              away={`${soccerStats.possession.away}%`}
              showBar
              homeValue={soccerStats.possession.home}
              awayValue={soccerStats.possession.away}
            />
            <StatRow
              label="Shots"
              home={soccerStats.shots.home}
              away={soccerStats.shots.away}
              showBar
              homeValue={soccerStats.shots.home}
              awayValue={soccerStats.shots.away}
            />
            <StatRow
              label="Shots on Target"
              home={soccerStats.shotsOnTarget.home}
              away={soccerStats.shotsOnTarget.away}
              showBar
              homeValue={soccerStats.shotsOnTarget.home}
              awayValue={soccerStats.shotsOnTarget.away}
            />
            <StatRow label="Corners" home={soccerStats.corners.home} away={soccerStats.corners.away} />
            <StatRow label="Fouls" home={soccerStats.fouls.home} away={soccerStats.fouls.away} />
            <StatRow label="Yellow Cards" home={soccerStats.yellowCards.home} away={soccerStats.yellowCards.away} />
            <StatRow label="Red Cards" home={soccerStats.redCards.home} away={soccerStats.redCards.away} />
            <StatRow label="Offsides" home={soccerStats.offsides.home} away={soccerStats.offsides.away} />
          </>
        )}

        {isFootball && (
          <>
            <StatRow label="First Downs" home={footballStats.firstDowns.home} away={footballStats.firstDowns.away} />
            <StatRow
              label="Total Yards"
              home={footballStats.totalYards.home}
              away={footballStats.totalYards.away}
              showBar
              homeValue={footballStats.totalYards.home}
              awayValue={footballStats.totalYards.away}
            />
            <StatRow
              label="Passing Yards"
              home={footballStats.passingYards.home}
              away={footballStats.passingYards.away}
            />
            <StatRow
              label="Rushing Yards"
              home={footballStats.rushingYards.home}
              away={footballStats.rushingYards.away}
            />
            <StatRow label="Penalties" home={footballStats.penalties.home} away={footballStats.penalties.away} />
            <StatRow label="Turnovers" home={footballStats.turnovers.home} away={footballStats.turnovers.away} />
            <StatRow
              label="Time of Possession"
              home={footballStats.timeOfPossession.home}
              away={footballStats.timeOfPossession.away}
            />
            <StatRow
              label="3rd Down Efficiency"
              home={footballStats.thirdDownEff.home}
              away={footballStats.thirdDownEff.away}
            />
          </>
        )}
      </div>
    </div>
  )
}

interface StatRowProps {
  label: string
  home: number | string
  away: number | string
  showBar?: boolean
  homeValue?: number
  awayValue?: number
}

interface StatRowProps {
  label: string
  home: number | string
  away: number | string
  showBar?: boolean
  homeValue?: number
  awayValue?: number
}

function StatRow({ label, home, away, showBar, homeValue, awayValue }: StatRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{label}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">{home}</span>
        {showBar && homeValue !== undefined && awayValue !== undefined && (
          <div className="flex-1 mx-4 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{
                width: `${(homeValue / (homeValue + awayValue)) * 100}%`,
              }}
            />
          </div>
        )}
        <span className="font-medium">{away}</span>
      </div>
    </div>
  )
}

