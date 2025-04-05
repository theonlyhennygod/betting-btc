"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Goal, Clock, AlertTriangle, User, UserMinus } from "lucide-react"
import type { Match } from "@/lib/types"

interface TimelineEvent {
  id: string
  time: string
  type: "goal" | "yellow-card" | "red-card" | "substitution" | "var" | "other"
  team: "home" | "away"
  player: string
  description: string
}

interface MatchTimelineProps {
  match: Match
  homeScore: number
  awayScore: number
}

export function MatchTimeline({ match, homeScore, awayScore }: MatchTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])

  // Generate initial events based on scores
  useEffect(() => {
    const initialEvents: TimelineEvent[] = []

    // Generate goal events based on current score
    for (let i = 0; i < homeScore; i++) {
      const minute = Math.floor(Math.random() * 90) + 1
      initialEvents.push({
        id: `home-goal-${i}`,
        time: `${minute}'`,
        type: "goal",
        team: "home",
        player: getRandomPlayer(match.homeTeam),
        description: `Goal for ${match.homeTeam}!`,
      })
    }

    for (let i = 0; i < awayScore; i++) {
      const minute = Math.floor(Math.random() * 90) + 1
      initialEvents.push({
        id: `away-goal-${i}`,
        time: `${minute}'`,
        type: "goal",
        team: "away",
        player: getRandomPlayer(match.awayTeam),
        description: `Goal for ${match.awayTeam}!`,
      })
    }

    // Add some random events
    const numRandomEvents = Math.floor(Math.random() * 8) + 2
    const eventTypes: ("yellow-card" | "substitution" | "var")[] = ["yellow-card", "substitution", "var"]

    for (let i = 0; i < numRandomEvents; i++) {
      const minute = Math.floor(Math.random() * 90) + 1
      const team = Math.random() > 0.5 ? "home" : "away"
      const teamName = team === "home" ? match.homeTeam : match.awayTeam
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]

      let description = ""
      switch (type) {
        case "yellow-card":
          description = `Yellow card for ${getRandomPlayer(teamName)}`
          break
        case "substitution":
          description = `${getRandomPlayer(teamName)} comes on for ${getRandomPlayer(teamName)}`
          break
        case "var":
          description = `VAR check for possible penalty`
          break
      }

      initialEvents.push({
        id: `random-${i}`,
        time: `${minute}'`,
        type,
        team,
        player: getRandomPlayer(teamName),
        description,
      })
    }

    // Sort events by time
    initialEvents.sort((a, b) => {
      const timeA = Number.parseInt(a.time.replace("'", ""))
      const timeB = Number.parseInt(b.time.replace("'", ""))
      return timeA - timeB
    })

    setEvents(initialEvents)
  }, [match.homeTeam, match.awayTeam, homeScore, awayScore])

  // Add new events when scores change
  useEffect(() => {
    const homeGoals = events.filter((e) => e.type === "goal" && e.team === "home").length
    const awayGoals = events.filter((e) => e.type === "goal" && e.team === "away").length

    if (homeScore > homeGoals) {
      // New home goal
      const minute = getCurrentMatchMinute(match)
      const newEvent: TimelineEvent = {
        id: `home-goal-${Date.now()}`,
        time: `${minute}'`,
        type: "goal",
        team: "home",
        player: getRandomPlayer(match.homeTeam),
        description: `Goal for ${match.homeTeam}!`,
      }

      setEvents((prev) =>
        [...prev, newEvent].sort((a, b) => {
          const timeA = Number.parseInt(a.time.replace("'", ""))
          const timeB = Number.parseInt(b.time.replace("'", ""))
          return timeB - timeA // Newest first
        }),
      )
    }

    if (awayScore > awayGoals) {
      // New away goal
      const minute = getCurrentMatchMinute(match)
      const newEvent: TimelineEvent = {
        id: `away-goal-${Date.now()}`,
        time: `${minute}'`,
        type: "goal",
        team: "away",
        player: getRandomPlayer(match.awayTeam),
        description: `Goal for ${match.awayTeam}!`,
      }

      setEvents((prev) =>
        [...prev, newEvent].sort((a, b) => {
          const timeA = Number.parseInt(a.time.replace("'", ""))
          const timeB = Number.parseInt(b.time.replace("'", ""))
          return timeB - timeA // Newest first
        }),
      )
    }
  }, [homeScore, awayScore, events, match])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-medium">{match.homeTeam}</div>
        <div className="text-2xl font-bold">
          {homeScore} - {awayScore}
        </div>
        <div className="text-lg font-medium">{match.awayTeam}</div>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={`flex items-start p-2 rounded-lg ${
              event.team === "home" ? "bg-zinc-800/30 justify-start" : "bg-zinc-800/30 justify-end"
            }`}
          >
            {event.team === "home" && (
              <div className="flex items-start">
                <Badge className="mr-2 bg-zinc-800 text-white">{event.time}</Badge>
                <div className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    {event.type === "goal" && <Goal className="h-4 w-4 text-amber-500" />}
                    {event.type === "yellow-card" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {event.type === "red-card" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    {event.type === "substitution" && <User className="h-4 w-4 text-green-500" />}
                    {event.type === "var" && <Clock className="h-4 w-4 text-blue-500" />}
                  </div>
                  <div>
                    <div className="font-medium">{event.player}</div>
                    <div className="text-xs text-muted-foreground">{event.description}</div>
                  </div>
                </div>
              </div>
            )}

            {event.team === "away" && (
              <div className="flex items-start">
                <div className="flex items-start">
                  <div className="text-right mr-2">
                    <div className="font-medium">{event.player}</div>
                    <div className="text-xs text-muted-foreground">{event.description}</div>
                  </div>
                  <div className="mr-2 mt-0.5">
                    {event.type === "goal" && <Goal className="h-4 w-4 text-amber-500" />}
                    {event.type === "yellow-card" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {event.type === "red-card" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    {event.type === "substitution" && <UserMinus className="h-4 w-4 text-green-500" />}
                    {event.type === "var" && <Clock className="h-4 w-4 text-blue-500" />}
                  </div>
                </div>
                <Badge className="ml-2 bg-zinc-800 text-white">{event.time}</Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper functions
function getRandomPlayer(team: string): string {
  const firstNames = [
    "John",
    "James",
    "Michael",
    "David",
    "Robert",
    "Carlos",
    "Juan",
    "Luis",
    "Kevin",
    "Marcus",
    "Leo",
    "Cristiano",
    "Kylian",
    "Erling",
    "Luka",
    "Toni",
    "Sergio",
    "Karim",
    "Trent",
    "Virgil",
  ]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Messi",
    "Ronaldo",
    "Mbappé",
    "Haaland",
    "Modrić",
    "Kroos",
    "Ramos",
    "Benzema",
    "Alexander-Arnold",
    "van Dijk",
  ]

  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
}

function getCurrentMatchMinute(match: Match): number {
  if (match.league === "Soccer" || match.league === "EPL" || match.league === "LaLiga") {
    // Extract minute from currentTime (e.g., "78'")
    return Number.parseInt(match.currentTime?.replace("'", "") || "45")
  } else if (match.league === "NBA") {
    // For NBA, convert quarter and time to an approximate "minute"
    const quarter = match.quarter || 1
    const timeRemaining = match.currentTime || "12:00"
    const [minutes, seconds] = timeRemaining.split(":").map(Number)

    // Each quarter is 12 minutes
    const quarterMinutes = 12
    const elapsedMinutes = (quarter - 1) * quarterMinutes + (quarterMinutes - minutes - seconds / 60)

    return Math.floor(elapsedMinutes)
  } else if (match.league === "NFL") {
    // For NFL, convert quarter and time to an approximate "minute"
    const quarter = match.quarter || 1
    const timeRemaining = match.currentTime || "15:00"
    const [minutes, seconds] = timeRemaining.split(":").map(Number)

    // Each quarter is 15 minutes
    const quarterMinutes = 15
    const elapsedMinutes = (quarter - 1) * quarterMinutes + (quarterMinutes - minutes - seconds / 60)

    return Math.floor(elapsedMinutes)
  }

  return 45 // Default
}

