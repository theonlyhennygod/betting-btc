export interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  league: string
  startTime: string
  homeOdds: string
  drawOdds: string
  awayOdds: string
  homeScore?: number
  awayScore?: number
  currentTime?: string
  quarter?: number
}

export interface FeaturedBet {
  id: string
  title: string
  event: string
  odds: string
  originalOdds?: string
  boosted?: boolean
  special?: boolean
}

export interface ParlayOption {
  id: string
  title: string
  odds: number
}

export interface FantasyPlayer {
  id: string
  name: string
  team: string
  position: string
  price: number
  projectedPoints: number
}

