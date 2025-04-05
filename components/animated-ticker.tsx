"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"

interface TickerItem {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  league: string
  status: string
  timeRemaining?: string
}

export function AnimatedTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([
    {
      id: "game1",
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      homeScore: 87,
      awayScore: 92,
      league: "NBA",
      status: "Q3",
      timeRemaining: "4:21",
    },
    {
      id: "game2",
      homeTeam: "Warriors",
      awayTeam: "Bucks",
      homeScore: 64,
      awayScore: 58,
      league: "NBA",
      status: "Q2",
      timeRemaining: "2:45",
    },
    {
      id: "game3",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      homeScore: 2,
      awayScore: 1,
      league: "EPL",
      status: "2H",
      timeRemaining: "78'",
    },
    {
      id: "game4",
      homeTeam: "Chiefs",
      awayTeam: "Ravens",
      homeScore: 21,
      awayScore: 17,
      league: "NFL",
      status: "Q3",
      timeRemaining: "8:12",
    },
    {
      id: "game5",
      homeTeam: "Yankees",
      awayTeam: "Red Sox",
      homeScore: 5,
      awayScore: 3,
      league: "MLB",
      status: "7th",
      timeRemaining: "TOP",
    },
    {
      id: "game6",
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      homeScore: 1,
      awayScore: 1,
      league: "LaLiga",
      status: "1H",
      timeRemaining: "32'",
    },
    {
      id: "game7",
      homeTeam: "Nets",
      awayTeam: "Heat",
      homeScore: 102,
      awayScore: 98,
      league: "NBA",
      status: "Q4",
      timeRemaining: "1:45",
    },
  ])

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [duration, setDuration] = useState(30)

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.scrollWidth)
    }

    // Simulate live score updates
    const interval = setInterval(() => {
      setTickerItems((prev) =>
        prev.map((item) => {
          // 30% chance to update a score
          if (Math.random() > 0.7) {
            const homeScoreChange = Math.random() > 0.7 ? 1 : 0
            const awayScoreChange = Math.random() > 0.7 ? 1 : 0

            return {
              ...item,
              homeScore: item.homeScore + homeScoreChange,
              awayScore: item.awayScore + awayScoreChange,
            }
          }
          return item
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-black border-y border-zinc-800 overflow-hidden">
      <div className="relative h-10" ref={containerRef}>
        <motion.div
          className="absolute flex whitespace-nowrap h-full items-center"
          animate={{
            x: [-containerWidth, 0],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration,
              ease: "linear",
            },
          }}
        >
          {tickerItems.map((item) => (
            <div key={item.id} className="flex items-center px-4 border-r border-zinc-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {item.league}
                </span>
                <span className="text-amber-500 text-xs">
                  {item.status} {item.timeRemaining}
                </span>
              </div>
              <div className="flex items-center ml-2">
                <span className="font-medium">{item.homeTeam}</span>
                <span className="mx-1 font-bold">{item.homeScore}</span>
                <span className="mx-0.5">-</span>
                <span className="font-bold">{item.awayScore}</span>
                <span className="ml-1 font-medium">{item.awayTeam}</span>
              </div>
              <Zap className="h-3 w-3 text-amber-500 ml-2" />
            </div>
          ))}
        </motion.div>

        <motion.div
          className="absolute flex whitespace-nowrap h-full items-center"
          animate={{
            x: [0, containerWidth],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration,
              ease: "linear",
            },
          }}
        >
          {tickerItems.map((item) => (
            <div key={item.id} className="flex items-center px-4 border-r border-zinc-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {item.league}
                </span>
                <span className="text-amber-500 text-xs">
                  {item.status} {item.timeRemaining}
                </span>
              </div>
              <div className="flex items-center ml-2">
                <span className="font-medium">{item.homeTeam}</span>
                <span className="mx-1 font-bold">{item.homeScore}</span>
                <span className="mx-0.5">-</span>
                <span className="font-bold">{item.awayScore}</span>
                <span className="ml-1 font-medium">{item.awayTeam}</span>
              </div>
              <Zap className="h-3 w-3 text-amber-500 ml-2" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

