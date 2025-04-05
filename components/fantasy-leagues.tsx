"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Plus, Trophy, Users, Zap } from "lucide-react"
import Link from "next/link"

export function FantasyLeagues() {
  const { toast } = useToast()
  const [isCreatingLeague, setIsCreatingLeague] = useState(false)
  const [leagueName, setLeagueName] = useState("")
  const [entryFee, setEntryFee] = useState("100000")
  const [inviteCode, setInviteCode] = useState("")

  const handleCreateLeague = () => {
    if (!leagueName) {
      toast({
        variant: "destructive",
        title: "League name required",
        description: "Please enter a name for your fantasy league",
      })
      return
    }

    setIsCreatingLeague(true)

    // Generate a random invite code
    const generatedCode = Math.random().toString(36).substring(2, 10).toUpperCase()

    // Simulate league creation
    setTimeout(() => {
      setInviteCode(generatedCode)
      setIsCreatingLeague(false)

      toast({
        title: "League created successfully!",
        description: `Your league "${leagueName}" has been created`,
      })
    }, 1500)
  }

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode)

    toast({
      title: "Invite code copied!",
      description: "Share this code with friends to join your league",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold">Fantasy Leagues</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              Create League
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle>Create Fantasy League</DialogTitle>
              <DialogDescription>Create a private league and invite your friends</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="league-name">League Name</Label>
                <Input
                  id="league-name"
                  placeholder="Enter league name"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-fee">Entry Fee (sats)</Label>
                <div className="flex items-center">
                  <Input
                    id="entry-fee"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <Zap className="h-4 w-4 text-amber-500 -ml-8" />
                </div>
              </div>

              {inviteCode && (
                <div className="space-y-2">
                  <Label htmlFor="invite-code">Invite Code</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="invite-code" value={inviteCode} readOnly className="bg-zinc-800 border-zinc-700" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-zinc-700"
                      onClick={handleCopyInviteCode}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={handleCreateLeague}
                disabled={isCreatingLeague}
              >
                {isCreatingLeague ? "Creating..." : "Create League"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-zinc-800">
          <CardHeader>
            <CardTitle>Satoshi's Circle</CardTitle>
            <CardDescription>Private League • 8 members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Season: 2025</div>
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">Active</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Entry Fee</div>
                <div className="flex items-center">
                  <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                  <span className="font-medium">100,000 sats</span>
                </div>
              </div>

              <div className="bg-zinc-800/50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Prize Pool</div>
                <div className="flex items-center">
                  <Trophy className="h-3.5 w-3.5 text-amber-500 mr-1" />
                  <span className="font-medium">800,000 sats</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-background flex items-center justify-center text-xs"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-background flex items-center justify-center text-xs">
                  +4
                </div>
              </div>

              <div className="text-sm">
                Your Rank: <span className="text-amber-500 font-medium">3rd</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/fantasy/leagues/1">View League</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-black/40 border-zinc-800">
          <CardHeader>
            <CardTitle>Lightning League</CardTitle>
            <CardDescription>Public League • 24 members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Season: 2025</div>
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">Active</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Entry Fee</div>
                <div className="flex items-center">
                  <Zap className="h-3.5 w-3.5 text-amber-500 mr-1" />
                  <span className="font-medium">50,000 sats</span>
                </div>
              </div>

              <div className="bg-zinc-800/50 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Prize Pool</div>
                <div className="flex items-center">
                  <Trophy className="h-3.5 w-3.5 text-amber-500 mr-1" />
                  <span className="font-medium">1,200,000 sats</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-background flex items-center justify-center text-xs"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-background flex items-center justify-center text-xs">
                  +20
                </div>
              </div>

              <div className="text-sm">
                Your Rank: <span className="text-amber-500 font-medium">12th</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/fantasy/leagues/2">View League</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-black/40 border-zinc-800">
          <CardHeader>
            <CardTitle>Join a League</CardTitle>
            <CardDescription>Enter an invite code to join a private league</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="join-code">Invite Code</Label>
              <Input id="join-code" placeholder="Enter invite code" className="bg-zinc-800 border-zinc-700" />
            </div>

            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              Join League
            </Button>

            <div className="text-center text-sm text-muted-foreground">or</div>

            <Button className="w-full" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Browse Public Leagues
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

