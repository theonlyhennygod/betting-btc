"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MatchStats } from "@/components/match-stats"
import { MatchTimeline } from "@/components/match-timeline"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import type { Match } from "@/lib/types"

interface LiveMatchDetailsProps {
  match: Match
}

export function LiveMatchDetails({ match }: LiveMatchDetailsProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return

    if (!isFullscreen) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Simulate score updates
  const [homeScore, setHomeScore] = useState(match.homeScore || 0)
  const [awayScore, setAwayScore] = useState(match.awayScore || 0)

  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance to update score
      if (Math.random() > 0.9) {
        if (Math.random() > 0.5) {
          setHomeScore((prev) => prev + 1)
        } else {
          setAwayScore((prev) => prev + 1)
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div ref={videoContainerRef} className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {/* Video player */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=720&width=1280"
            alt="Live stream"
            width={1280}
            height={720}
            className="w-full h-full object-cover"
          />

          {/* Overlay for when video is paused */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-white text-center">
                <Play className="h-16 w-16 mx-auto" />
                <p className="mt-2">Click to resume</p>
              </div>
            </div>
          )}

          {/* Live indicator and score */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/20">
              LIVE
            </Badge>
            <span className="text-white font-bold text-lg">
              {homeScore} - {awayScore}
            </span>
          </div>

          {/* Video controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button onClick={togglePlay} className="text-white hover:text-amber-500 transition-colors">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>
                <button onClick={toggleMute} className="text-white hover:text-amber-500 transition-colors">
                  {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </button>
                <div className="text-white text-sm">
                  {match.league === "Soccer" ? match.currentTime : `Q${match.quarter} ${match.currentTime}`}
                </div>
              </div>
              <button onClick={toggleFullscreen} className="text-white hover:text-amber-500 transition-colors">
                {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-black/40 border-zinc-800">
        <CardContent className="p-0">
          <Tabs defaultValue="stats">
            <TabsList className="w-full grid grid-cols-2 rounded-none bg-zinc-900">
              <TabsTrigger value="stats">Match Stats</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="stats" className="p-4">
              <MatchStats match={match} homeScore={homeScore} awayScore={awayScore} />
            </TabsContent>
            <TabsContent value="timeline" className="p-4">
              <MatchTimeline match={match} homeScore={homeScore} awayScore={awayScore} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

