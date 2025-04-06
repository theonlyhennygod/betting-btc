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
        {/* Conditional Video Player */}
        <div className="absolute inset-0">
          {match.id === "live-1" ? (
            // Specific iframe for Knicks vs Bulls
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/z3gNzxyyDYI?si=uSyF2IHX35LzGlQ7" 
              title="YouTube video player (Knicks vs Bulls)" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          ) : match.id === "live-2" ? (
            // Specific iframe for Man United vs Tottenham
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/WcI_hFXVrvc?si=H2gNk3bwKss-LS_Q" 
              title="YouTube video player (Man United vs Tottenham)" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          ) : match.id === "live-3" ? (
            // Specific iframe for Suns vs Nuggets
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/M77ddPuIs_A?si=Q07emtyy06E54iWg"
              title="YouTube video player (Suns vs Nuggets)"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          ) : (
            // Default iframe for other matches
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/1MAXIgtrDDM?si=-UhxLlODXnO1pKQF" // Default video
              title="YouTube video player (Default)" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
            // Placeholder alternative:
            // <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-muted-foreground">
            //   Live stream not available for this match.
            // </div>
          )}

          {/* Overlay for when video is paused - This might not work directly with iframe */}
          {/* Consider removing or adapting this based on iframe interaction limitations */}
          {/*!isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-white text-center">
                <Play className="h-16 w-16 mx-auto" />
                <p className="mt-2">Click to resume</p>
              </div>
            </div>
          )*/}

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
