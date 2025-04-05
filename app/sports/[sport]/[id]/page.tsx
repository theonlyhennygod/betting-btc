"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Clock, Lock, Shield, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { sportFixtures } from "@/lib/fixtures"
import { formatDate } from "@/lib/utils"
import { useLightningInvoice } from "@/hooks/use-lightning-invoice"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { useTaprootEscrow } from "@/hooks/use-taproot-escrow"
import { TaprootEscrowExplainer } from "@/components/taproot-escrow-explainer"
import { notFound } from "next/navigation"

interface MatchDetailPageProps {
  params: {
    sport: string
    id: string
  }
}

export default function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { sport, id } = params
  const { toast } = useToast()
  const { isAuthenticated } = useWalletAuth()
  const { createInvoice } = useLightningInvoice()
  const { createEscrow, fundEscrow } = useTaprootEscrow()

  // Find the match in fixtures
  const allFixtures = Object.values(sportFixtures).flat()
  const match = allFixtures.find((m) => m.id === id)

  if (!match) {
    notFound()
  }

  const [selectedBetType, setSelectedBetType] = useState("match-winner")
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [betAmount, setBetAmount] = useState("10000")
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const [escrowStatus, setEscrowStatus] = useState<string | null>(null)
  const [escrowAddress, setEscrowAddress] = useState<string | null>(null)

  // Calculate potential win based on selected outcome and bet amount
  const calculatePotentialWin = () => {
    if (!selectedOutcome) return 0

    let odds = 0

    if (selectedBetType === "match-winner") {
      if (selectedOutcome === match.homeTeam) {
        odds = Number.parseFloat(match.homeOdds)
      } else if (selectedOutcome === match.awayTeam) {
        odds = Number.parseFloat(match.awayOdds)
      } else if (selectedOutcome === "Draw") {
        odds = Number.parseFloat(match.drawOdds)
      }
    } else if (selectedBetType === "spread") {
      odds = 1.91 // Standard spread odds
    } else if (selectedBetType === "totals") {
      odds = 1.91 // Standard totals odds
    }

    return Math.round(Number.parseInt(betAmount) * odds)
  }

  const handlePlaceBet = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please connect your Lightning wallet to place a bet",
      })
      return
    }

    if (!selectedOutcome) {
      toast({
        variant: "destructive",
        title: "Selection required",
        description: "Please select an outcome to bet on",
      })
      return
    }

    setIsPlacingBet(true)
    setEscrowStatus("Creating Taproot escrow...")

    try {
      // Step 1: Create a Taproot escrow for the bet
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 48) // 48 hours expiry

      // Determine odds based on selection and bet type
      let odds = 0
      if (selectedBetType === "match-winner") {
        if (selectedOutcome === match.homeTeam) {
          odds = Number.parseFloat(match.homeOdds)
        } else if (selectedOutcome === match.awayTeam) {
          odds = Number.parseFloat(match.awayOdds)
        } else if (selectedOutcome === "Draw") {
          odds = Number.parseFloat(match.drawOdds)
        }
      } else if (selectedBetType === "spread" || selectedBetType === "totals") {
        odds = 1.91 // Standard odds for these bet types
      }

      const escrow = await createEscrow({
        amount: Number.parseInt(betAmount),
        betId: `bet_${Math.random().toString(36).substring(2, 15)}`,
        matchId: match.id,
        selectedOutcome,
        odds,
        expiresAt,
      })

      setEscrowAddress(escrow.taprootAddress)
      setEscrowStatus("Funding escrow via Lightning...")

      // Step 2: Create a BOLT11 invoice for the bet amount
      const invoice = await createInvoice({
        amount: Number.parseInt(betAmount),
        memo: `Bet on ${match.homeTeam} vs ${match.awayTeam} - ${selectedOutcome}`,
        expiresIn: 600, // 10 minutes
      })

      // Step 3: Fund the escrow with the invoice payment
      await fundEscrow(escrow.id, invoice.paymentRequest)

      setEscrowStatus("Confirming on blockchain...")

      // Step 4: Wait for confirmation (simulated)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Bet placed successfully!",
        description: (
          <div className="space-y-2">
            <p>
              You bet {Number.parseInt(betAmount).toLocaleString()} sats on {selectedOutcome}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Shield className="h-3 w-3 mr-1 text-amber-500" />
              <span>Protected by Taproot Escrow</span>
            </div>
          </div>
        ),
      })

      setSelectedOutcome(null)
      setBetAmount("10000")
      setEscrowStatus(null)
      setEscrowAddress(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to place bet",
        description: "There was an error processing your payment",
      })
      setEscrowStatus(null)
      setEscrowAddress(null)
    } finally {
      setIsPlacingBet(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8 border-zinc-700" asChild>
          <Link href={`/sports/${sport}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {match.homeTeam} vs {match.awayTeam}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/40 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatDate(match.startTime)}</span>
                </div>
                <div className="text-sm font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                  {match.league}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                    <Image src={`/placeholder.svg?height=80&width=80`} alt={match.homeTeam} width={48} height={48} />
                  </div>
                  <div className="text-lg font-medium">{match.homeTeam}</div>
                  <div className="text-sm text-muted-foreground">Home</div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold mb-2">VS</div>
                  <div className="text-sm text-muted-foreground">
                    {match.league === "Soccer" ? "Match Odds" : "Game Odds"}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                    <div className="bg-zinc-800/50 p-2 rounded">
                      <div className="text-xs text-muted-foreground">Home</div>
                      <div className="font-medium text-amber-500">{match.homeOdds}</div>
                    </div>
                    <div className="bg-zinc-800/50 p-2 rounded">
                      <div className="text-xs text-muted-foreground">Draw</div>
                      <div className="font-medium text-amber-500">{match.drawOdds}</div>
                    </div>
                    <div className="bg-zinc-800/50 p-2 rounded">
                      <div className="text-xs text-muted-foreground">Away</div>
                      <div className="font-medium text-amber-500">{match.awayOdds}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                    <Image src={`/placeholder.svg?height=80&width=80`} alt={match.awayTeam} width={48} height={48} />
                  </div>
                  <div className="text-lg font-medium">{match.awayTeam}</div>
                  <div className="text-sm text-muted-foreground">Away</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-zinc-800">
            <CardHeader>
              <CardTitle>Betting Markets</CardTitle>
              <CardDescription>Available betting options for this match</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="match-winner" onValueChange={setSelectedBetType}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="match-winner">Match Winner</TabsTrigger>
                  <TabsTrigger value="spread">Spread</TabsTrigger>
                  <TabsTrigger value="totals">Totals</TabsTrigger>
                </TabsList>

                <TabsContent value="match-winner">
                  <RadioGroup value={selectedOutcome || ""} onValueChange={setSelectedOutcome}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={match.homeTeam} id="home" />
                          <Label htmlFor="home" className="cursor-pointer">
                            {match.homeTeam} <span className="text-amber-500 ml-2">({match.homeOdds})</span>
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Draw" id="draw" />
                          <Label htmlFor="draw" className="cursor-pointer">
                            Draw <span className="text-amber-500 ml-2">({match.drawOdds})</span>
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={match.awayTeam} id="away" />
                          <Label htmlFor="away" className="cursor-pointer">
                            {match.awayTeam} <span className="text-amber-500 ml-2">({match.awayOdds})</span>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </TabsContent>

                <TabsContent value="spread">
                  <RadioGroup value={selectedOutcome || ""} onValueChange={setSelectedOutcome}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={`${match.homeTeam} -3.5`} id="home-spread" />
                          <Label htmlFor="home-spread" className="cursor-pointer">
                            {match.homeTeam} -3.5 <span className="text-amber-500 ml-2">(1.91)</span>
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={`${match.awayTeam} +3.5`} id="away-spread" />
                          <Label htmlFor="away-spread" className="cursor-pointer">
                            {match.awayTeam} +3.5 <span className="text-amber-500 ml-2">(1.91)</span>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </TabsContent>

                <TabsContent value="totals">
                  <RadioGroup value={selectedOutcome || ""} onValueChange={setSelectedOutcome}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Over 220.5" id="over" />
                          <Label htmlFor="over" className="cursor-pointer">
                            Over 220.5 <span className="text-amber-500 ml-2">(1.91)</span>
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Under 220.5" id="under" />
                          <Label htmlFor="under" className="cursor-pointer">
                            Under 220.5 <span className="text-amber-500 ml-2">(1.91)</span>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </TabsContent>
              </Tabs>

              <div className="mt-4">
                <TaprootEscrowExplainer />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-black/40 border-zinc-800 sticky top-20">
            <CardHeader>
              <CardTitle>Bet Slip</CardTitle>
              <CardDescription>Review and place your bet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedOutcome ? (
                <>
                  <div className="p-3 rounded-md bg-zinc-800/50">
                    <div className="text-sm font-medium mb-1">
                      {match.homeTeam} vs {match.awayTeam}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{formatDate(match.startTime)}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        {selectedBetType === "match-winner"
                          ? "Match Winner"
                          : selectedBetType === "spread"
                            ? "Spread"
                            : "Totals"}
                      </div>
                      <div className="text-sm font-medium">{selectedOutcome}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bet-amount">Bet Amount (sats)</Label>
                    <div className="flex items-center">
                      <Input
                        id="bet-amount"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="bg-zinc-800 border-zinc-700"
                      />
                      <Zap className="h-4 w-4 text-amber-500 -ml-8" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-amber-500/10">
                    <div className="text-sm">Potential Win</div>
                    <div className="text-sm font-medium text-amber-500">
                      {calculatePotentialWin().toLocaleString()} sats
                    </div>
                  </div>

                  {escrowStatus && (
                    <div className="p-3 bg-amber-500/10 rounded-md border border-amber-500/20">
                      <div className="flex items-center text-sm mb-2">
                        <Lock className="h-4 w-4 mr-2 text-amber-500 animate-pulse" />
                        <span>{escrowStatus}</span>
                      </div>
                      {escrowAddress && (
                        <div className="text-xs text-muted-foreground break-all">
                          <span className="font-medium">Taproot address:</span> {escrowAddress}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Select a betting market to place your bet</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                disabled={!selectedOutcome || isPlacingBet}
                onClick={handlePlaceBet}
              >
                {isPlacingBet ? (
                  "Processing..."
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Place Bet with Taproot Escrow
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

