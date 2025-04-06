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
  homeTeamLogoUrl?: string
  awayTeamLogoUrl?: string

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
  imageUrl?: string | null
}

export interface Escrow {
  id: string
  matchId: string
  userId: string
  betAmount: number
  selectedOutcome: string
  odds: number
  expiresAt: string
  status: "pending" | "funded" | "disputed" | "resolved" | "expired"
  outcome?: "home" | "away" | "draw" | "cancelled"
  txid?: string
  escrowAddress?: string
}
