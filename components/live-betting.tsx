"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Calculator, ChevronDown, ChevronUp, Lock, Shield, Zap } from "lucide-react"
import { useLightningInvoice } from "@/hooks/use-lightning-invoice"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { useTaprootEscrow } from "@/hooks/use-taproot-escrow"
import { TaprootEscrowExplainer } from "@/components/taproot-escrow-explainer"
import type { Match } from "@/lib/types"

interface LiveBettingProps {
  match: Match
}

export function LiveBetting({ match }: LiveBettingProps) {
  const { toast } = useToast()
  const { isAuthenticated } = useWalletAuth()
  const { createInvoice } = useLightningInvoice()
  const { createEscrow, fundEscrow } = useTaprootEscrow()

  const [betAmount, setBetAmount] = useState("10000")
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const [showBetSlip, setShowBetSlip] = useState(true)
  const [escrowStatus, setEscrowStatus] = useState<string | null>(null)
  const [escrowAddress, setEscrowAddress] = useState<string | null>(null)

  // Live odds that change over time
  const [homeOdds, setHomeOdds] = useState(Number.parseFloat(match.homeOdds))
  const [drawOdds, setDrawOdds] = useState(Number.parseFloat(match.drawOdds))
  const [awayOdds, setAwayOdds] = useState(Number.parseFloat(match.awayOdds))

  // Prop bets
  const propBets = [
    {
      id: "prop1",
      description: `Next ${match.league === "NBA" ? "scorer" : match.league === "Soccer" ? "goal" : "touchdown"}`,
      options: [
        { id: "prop1-1", label: getRandomPlayer(match.homeTeam), odds: (Math.random() * 4 + 2).toFixed(2) },
        { id: "prop1-2", label: getRandomPlayer(match.awayTeam), odds: (Math.random() * 4 + 2).toFixed(2) },
        { id: "prop1-3", label: getRandomPlayer(match.homeTeam), odds: (Math.random() * 4 + 2).toFixed(2) },
      ],
    },
    {
      id: "prop2",
      description:
        match.league === "NBA" ? "Total points" : match.league === "Soccer" ? "Total goals" : "Total touchdowns",
      options: [
        { id: "prop2-1", label: "Over 4.5", odds: "1.85" },
        { id: "prop2-2", label: "Under 4.5", odds: "1.95" },
      ],
    },
    {
      id: "prop3",
      description: "Next event",
      options: [
        { id: "prop3-1", label: match.league === "Soccer" ? "Corner" : "Free throw", odds: "2.20" },
        { id: "prop3-2", label: match.league === "Soccer" ? "Goal kick" : "3-pointer", odds: "2.50" },
        { id: "prop3-3", label: match.league === "Soccer" ? "Yellow card" : "Foul", odds: "3.00" },
      ],
    },
  ]

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

      // Determine the odds based on selection
      let odds = 0
      if (selectedOutcome === match.homeTeam) {
        odds = homeOdds
      } else if (selectedOutcome === match.awayTeam) {
        odds = awayOdds
      } else if (selectedOutcome === "Draw") {
        odds = drawOdds
      } else {
        // For prop bets and specials, extract odds from the selection
        const propBetOption = propBets.flatMap((bet) => bet.options).find((option) => option.label === selectedOutcome)
        if (propBetOption) {
          odds = Number.parseFloat(propBetOption.odds)
        } else {
          // Default odds for special bets
          odds = 3.0
        }
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
        memo: `Live bet on ${match.homeTeam} vs ${match.awayTeam} - ${selectedOutcome}`,
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

  const potentialWin =
    selectedOutcome === match.homeTeam
      ? Number.parseInt(betAmount) * homeOdds
      : selectedOutcome === match.awayTeam
        ? Number.parseInt(betAmount) * awayOdds
        : selectedOutcome === "Draw"
          ? Number.parseInt(betAmount) * drawOdds
          : 0

  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Live Betting</CardTitle>
            <CardDescription>Place bets in real-time</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowBetSlip(!showBetSlip)}>
            {showBetSlip ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {showBetSlip && (
        <>
          <CardContent className="pt-0">
            <Tabs defaultValue="match">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="match">Match</TabsTrigger>
                <TabsTrigger value="props">Props</TabsTrigger>
                <TabsTrigger value="specials">Specials</TabsTrigger>
              </TabsList>

              <TabsContent value="match">
                <RadioGroup value={selectedOutcome || ""} onValueChange={setSelectedOutcome}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between space-x-2 p-2 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={match.homeTeam} id="home" />
                        <Label htmlFor="home" className="cursor-pointer">
                          {match.homeTeam}
                        </Label>
                      </div>
                      <div className="text-amber-500 font-medium">{homeOdds.toFixed(2)}</div>
                    </div>

                    <div className="flex items-center justify-between space-x-2 p-2 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Draw" id="draw" />
                        <Label htmlFor="draw" className="cursor-pointer">
                          Draw
                        </Label>
                      </div>
                      <div className="text-amber-500 font-medium">{drawOdds.toFixed(2)}</div>
                    </div>

                    <div className="flex items-center justify-between space-x-2 p-2 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={match.awayTeam} id="away" />
                        <Label htmlFor="away" className="cursor-pointer">
                          {match.awayTeam}
                        </Label>
                      </div>
                      <div className="text-amber-500 font-medium">{awayOdds.toFixed(2)}</div>
                    </div>
                  </div>
                </RadioGroup>
              </TabsContent>

              <TabsContent value="props">
                <div className="space-y-4">
                  {propBets.map((propBet) => (
                    <div key={propBet.id} className="space-y-2">
                      <div className="text-sm font-medium">{propBet.description}</div>
                      <div className="space-y-2">
                        {propBet.options.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center justify-between p-2 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                            onClick={() => setSelectedOutcome(option.label)}
                          >
                            <div className="text-sm">{option.label}</div>
                            <div className="text-amber-500 font-medium">{option.odds}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="specials">
                <div className="space-y-2">
                  <div
                    className="flex items-center justify-between p-2 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedOutcome(`${match.homeTeam} to win by 10+ points`)}
                  >
                    <div className="text-sm">
                      {match.homeTeam} to win by 10+{" "}
                      {match.league === "NBA" ? "points" : match.league === "Soccer" ? "goals" : "points"}
                    </div>
                    <div className="text-amber-500 font-medium">4.50</div>
                  </div>

                  <div
                    className="flex items-center justify-between p-2 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedOutcome(`${match.awayTeam} to win by 10+ points`)}
                  >
                    <div className="text-sm">
                      {match.awayTeam} to win by 10+{" "}
                      {match.league === "NBA" ? "points" : match.league === "Soccer" ? "goals" : "points"}
                    </div>
                    <div className="text-amber-500 font-medium">5.00</div>
                  </div>

                  <div
                    className="flex items-center justify-between p-2 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedOutcome("Both teams to score in next 10 minutes")}
                  >
                    <div className="text-sm">Both teams to score in next 10 minutes</div>
                    <div className="text-amber-500 font-medium">7.50</div>
                  </div>

                  <div
                    className="flex items-center justify-between p-2 rounded-md border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedOutcome("No more scoring")}
                  >
                    <div className="text-sm">No more scoring</div>
                    <div className="text-amber-500 font-medium">3.25</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {selectedOutcome && (
              <>
                <Separator className="my-4 bg-zinc-800" />

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Your selection</div>
                    <div className="p-2 rounded-md bg-zinc-800/50">{selectedOutcome}</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="live-bet-amount">Bet Amount (sats)</Label>
                    <div className="flex items-center">
                      <Input
                        id="live-bet-amount"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="bg-zinc-800 border-zinc-700"
                      />
                      <Zap className="h-4 w-4 text-amber-500 -ml-8" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-amber-500/10 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Potential Win</span>
                    </div>
                    <span className="text-sm font-medium text-amber-500">
                      {Math.round(potentialWin).toLocaleString()} sats
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <TaprootEscrowExplainer />
                  </div>
                </div>
              </>
            )}

            {escrowStatus && (
              <div className="mt-4 p-3 bg-amber-500/10 rounded-md border border-amber-500/20">
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
          </CardContent>

          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              disabled={isPlacingBet || !selectedOutcome}
              onClick={handlePlaceBet}
            >
              {isPlacingBet ? (
                <>Processing...</>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Place Bet with Taproot Escrow
                </>
              )}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

// Helper function
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

