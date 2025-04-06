import type { Match, FeaturedBet, ParlayOption, FantasyPlayer } from "./types"

// Sample data for upcoming matches
export const sportFixtures: Record<string, Match[]> = {
  nba: [
    {
      id: "nba-1",
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      league: "NBA",
      startTime: "2025-04-06T19:00:00Z",
      homeOdds: "1.95",
      drawOdds: "15.00",
      awayOdds: "1.85",
      homeTeamLogoUrl: "/images/lakers.webp",
      awayTeamLogoUrl: "/images/celtics.webp"
    },
    {
      id: "nba-2",
      homeTeam: "Warriors",
      awayTeam: "Bucks",
      league: "NBA",
      startTime: "2025-04-06T21:30:00Z",
      homeOdds: "1.75",
      drawOdds: "15.00",
      awayOdds: "2.10",
      homeTeamLogoUrl: "/images/goldenstate.webp",
      awayTeamLogoUrl: "/images/bucks.webp"
    },
    {
      id: "nba-3",
      homeTeam: "Nets",
      awayTeam: "Heat",
      league: "NBA",
      startTime: "2025-04-07T18:00:00Z",
      homeOdds: "2.20",
      drawOdds: "15.00",
      awayOdds: "1.65",
      homeTeamLogoUrl: "/images/nets.webp",
      awayTeamLogoUrl: "/images/miami.png"
    },
  ],
  nfl: [
    {
      id: "nfl-1",
      homeTeam: "Chiefs",
      awayTeam: "Ravens",
      league: "NFL",
      startTime: "2025-04-08T20:00:00Z",
      homeOdds: "1.90",
      drawOdds: "12.00",
      awayOdds: "1.90",
      homeTeamLogoUrl: "/images/chiefs.webp",
      awayTeamLogoUrl: "/images/ravens.png"
    },
    {
      id: "nfl-2",
      homeTeam: "Eagles",
      awayTeam: "Cowboys",
      league: "NFL",
      startTime: "2025-04-09T19:30:00Z",
      homeOdds: "2.05",
      drawOdds: "12.00",
      awayOdds: "1.80",
      homeTeamLogoUrl: "/images/eagles.png",
      awayTeamLogoUrl: "/images/cowboys.png"
    },
    {
      id: "nfl-3",
      homeTeam: "49ers",
      awayTeam: "Packers",
      league: "NFL",
      startTime: "2025-04-10T20:15:00Z",
      homeOdds: "1.75",
      drawOdds: "12.00",
      awayOdds: "2.15",
      homeTeamLogoUrl: "/images/49ers.png",
      awayTeamLogoUrl: "/images/packers.webp"
    },
  ],
  mlb: [
    {
      id: "mlb-1",
      homeTeam: "Yankees",
      awayTeam: "Red Sox",
      league: "MLB",
      startTime: "2025-04-06T18:05:00Z",
      homeOdds: "1.85",
      drawOdds: "8.50",
      awayOdds: "1.95",
      homeTeamLogoUrl: "/images/yankees.png",
      awayTeamLogoUrl: "/images/redsox.png"
    },
    {
      id: "mlb-2",
      homeTeam: "Dodgers",
      awayTeam: "Giants",
      league: "MLB",
      startTime: "2025-04-07T22:10:00Z",
      homeOdds: "1.70",
      drawOdds: "8.50",
      awayOdds: "2.20",
      homeTeamLogoUrl: "/images/dodgers.webp",
      awayTeamLogoUrl: null
    },
    {
      id: "mlb-3",
      homeTeam: "Cubs",
      awayTeam: "Cardinals",
      league: "MLB",
      startTime: "2025-04-08T19:20:00Z",
      homeOdds: "2.10",
      drawOdds: "8.50",
      awayOdds: "1.75",
      homeTeamLogoUrl: "/images/cubs.webp",
      awayTeamLogoUrl: "/images/cardinals.png"
    },
  ],
  soccer: [
    {
      id: "soccer-1",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      league: "Soccer",
      startTime: "2025-04-06T15:00:00Z",
      homeOdds: "2.20",
      drawOdds: "3.40",
      awayOdds: "3.10",
      homeTeamLogoUrl: "/images/arsenal.png",
      awayTeamLogoUrl: "/images/chelsea.png"
    },
    {
      id: "soccer-2",
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      league: "Soccer",
      startTime: "2025-04-07T20:00:00Z",
      homeOdds: "2.50",
      drawOdds: "3.30",
      awayOdds: "2.70",
      homeTeamLogoUrl: "/images/barcelona.svg.webp",
      awayTeamLogoUrl: "/images/realmadrid.webp"
    },
    {
      id: "soccer-3",
      homeTeam: "Liverpool",
      awayTeam: "Man City",
      league: "Soccer",
      startTime: "2025-04-08T19:45:00Z",
      homeOdds: "2.80",
      drawOdds: "3.40",
      awayOdds: "2.40",
      homeTeamLogoUrl: "/images/liverpool.png",
      awayTeamLogoUrl: "/images/manchester.png"
    },
  ],
}

// Sample data for live matches
export const liveFixtures: Match[] = [
  {
    id: "live-1",
    homeTeam: "Knicks",
    awayTeam: "Bulls",
    league: "NBA",
    startTime: "2025-04-05T19:00:00Z",
    homeOdds: "1.65",
    drawOdds: "15.00",
    awayOdds: "2.30",
    homeScore: 68,
    awayScore: 72,
    currentTime: "7:42",
    quarter: 3,
  },
  {
    id: "live-2",
    homeTeam: "Man United",
    awayTeam: "Tottenham",
    league: "Soccer",
    startTime: "2025-04-05T14:00:00Z",
    homeOdds: "2.10",
    drawOdds: "3.20",
    awayOdds: "3.50",
    homeScore: 1,
    awayScore: 1,
    currentTime: "67'",
  },
  {
    id: "live-3",
    homeTeam: "Suns",
    awayTeam: "Nuggets",
    league: "NBA",
    startTime: "2025-04-05T21:30:00Z",
    homeOdds: "2.20",
    drawOdds: "15.00",
    awayOdds: "1.70",
    homeScore: 32,
    awayScore: 29,
    currentTime: "4:18",
    quarter: 2,
  },
]

// Sample data for featured bets
export const featuredBets: {
  popular: FeaturedBet[]
  boosted: FeaturedBet[]
  specials: FeaturedBet[]
} = {
  popular: [
    {
      id: "pop-1",
      title: "Lakers to win",
      event: "Lakers vs Celtics",
      odds: "1.95",
    },
    {
      id: "pop-2",
      title: "Chiefs -3.5",
      event: "Chiefs vs Ravens",
      odds: "1.90",
    },
    {
      id: "pop-3",
      title: "Barcelona & Liverpool both to win",
      event: "Multiple Events",
      odds: "4.50",
      boosted: true,
    },
  ],
  boosted: [
    {
      id: "boost-1",
      title: "LeBron James to score 30+ points",
      event: "Lakers vs Celtics",
      odds: "3.50",
      originalOdds: "2.80",
      boosted: true,
    },
    {
      id: "boost-2",
      title: "Barcelona to win & both teams to score",
      event: "Barcelona vs Real Madrid",
      odds: "4.00",
      originalOdds: "3.20",
      boosted: true,
    },
    {
      id: "boost-3",
      title: "Chiefs, Eagles & 49ers all to win",
      event: "Multiple Events",
      odds: "6.50",
      originalOdds: "5.00",
      boosted: true,
    },
  ],
  specials: [
    {
      id: "special-1",
      title: "Any player to score 50+ points this week",
      event: "NBA Special",
      odds: "3.00",
      special: true,
    },
    {
      id: "special-2",
      title: "Hat-trick to be scored in El Clasico",
      event: "Barcelona vs Real Madrid",
      odds: "7.50",
      special: true,
    },
    {
      id: "special-3",
      title: "Any game to go to overtime this weekend",
      event: "NBA Special",
      odds: "2.20",
      special: true,
    },
  ],
}

// Sample data for parlay options
export const parlayOptions: ParlayOption[] = [
  {
    id: "parlay-1",
    title: "Lakers to win vs Celtics",
    odds: 1.95,
  },
  {
    id: "parlay-2",
    title: "Warriors -4.5 vs Bucks",
    odds: 1.9,
  },
  {
    id: "parlay-3",
    title: "Heat to win vs Nets",
    odds: 1.65,
  },
  {
    id: "parlay-4",
    title: "Chiefs to win vs Ravens",
    odds: 1.9,
  },
  {
    id: "parlay-5",
    title: "Eagles -3.5 vs Cowboys",
    odds: 1.85,
  },
  {
    id: "parlay-6",
    title: "Barcelona to win vs Real Madrid",
    odds: 2.5,
  },
  {
    id: "parlay-7",
    title: "Liverpool & Man City both teams to score",
    odds: 1.75,
  },
  {
    id: "parlay-8",
    title: "Yankees vs Red Sox over 8.5 runs",
    odds: 1.9,
  },
]

// Sample data for fantasy players
export const fantasyPlayers: FantasyPlayer[] = [
  {
    id: "fp-1",
    name: "Patrick Mahomes",
    team: "Chiefs",
    position: "QB",
    price: 25000,
    projectedPoints: 24.5,
    imageUrl: "/images/patrick.png"
  },
  {
    id: "fp-2",
    name: "Josh Allen",
    team: "Bills",
    position: "QB",
    price: 23000,
    projectedPoints: 22.8,
    imageUrl: "/images/josh.png"
  },
  {
    id: "fp-3",
    name: "Lamar Jackson",
    team: "Ravens",
    position: "QB",
    price: 22000,
    projectedPoints: 23.2,
    imageUrl: "/images/lamar.png"
  },
  {
    id: "fp-4",
    name: "Christian McCaffrey",
    team: "49ers",
    position: "RB",
    price: 28000,
    projectedPoints: 25.7,
    imageUrl: "/images/christian.png"
  },
  {
    id: "fp-5",
    name: "Derrick Henry",
    team: "Ravens",
    position: "RB",
    price: 24000,
    projectedPoints: 20.3,
    imageUrl: "/images/derrick.png"
  },
  {
    id: "fp-6",
    name: "Saquon Barkley",
    team: "Eagles",
    position: "RB",
    price: 21000,
    projectedPoints: 19.5,
    imageUrl: "/images/saquan.png"
  },
  {
    id: "fp-7",
    name: "CeeDee Lamb",
    team: "Cowboys",
    position: "WR",
    price: 26000,
    projectedPoints: 21.8,
    imageUrl: "/images/ceedee.png"
  },
  {
    id: "fp-8",
    name: "Tyreek Hill",
    team: "Dolphins",
    position: "WR",
    price: 27000,
    projectedPoints: 22.5,
    imageUrl: "/images/tyreke.png"
  },
  {
    id: "fp-9",
    name: "Justin Jefferson",
    team: "Vikings",
    position: "WR",
    price: 29000,
    projectedPoints: 23.0,
    imageUrl: "/images/justinjefferson.png"
  },
  {
    id: "fp-10",
    name: "Travis Kelce",
    team: "Chiefs",
    position: "TE",
    price: 20000,
    projectedPoints: 18.5,
    imageUrl: "/images/travis.png"
  },
  {
    id: "fp-11",
    name: "George Kittle",
    team: "49ers",
    position: "TE",
    price: 18000,
    projectedPoints: 16.2,
    imageUrl: "/images/george.png"
  },
  {
    id: "fp-12",
    name: "Mark Andrews",
    team: "Ravens",
    position: "TE",
    price: 19000,
    projectedPoints: 17.0,
    imageUrl: "/images/mark.png"
  },
]

