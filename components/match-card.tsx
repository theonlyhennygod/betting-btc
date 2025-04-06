"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Lock, Shield, Zap } from "lucide-react"
import { useLightningInvoice } from "@/hooks/use-lightning-invoice"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { useTaprootEscrow } from "@/hooks/use-taproot-escrow"
import { formatDate } from "@/lib/utils"
import { TaprootEscrowExplainer } from "@/components/taproot-escrow-explainer"
import type { Match } from "@/lib/types"

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const { toast } = useToast()
  const { isAuthenticated } = useWalletAuth()
  const { createInvoice } = useLightningInvoice()
  const { createEscrow, fundEscrow } = useTaprootEscrow()

  const [betAmount, setBetAmount] = useState("10000")
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const [showBetDialog, setShowBetDialog] = useState(false)
  const [escrowStatus, setEscrowStatus] = useState<string | null>(null)
  const [escrowAddress, setEscrowAddress] = useState<string | null>(null)

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

      const odds =
        selectedOutcome === match.homeTeam
          ? Number.parseFloat(match.homeOdds)
          : selectedOutcome === match.awayTeam
            ? Number.parseFloat(match.awayOdds)
            : Number.parseFloat(match.drawOdds)

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

      setShowBetDialog(false)
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
    <Card className="overflow-hidden border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDate(match.startTime)}</span>
            </div>
            <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
              {match.league}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                <Image 
                  src={match.homeTeamLogoUrl || `/placeholder.svg?height=48&width=48`}
                  alt={match.homeTeam}
                  width={match.homeTeamLogoUrl ? 48 : 32}
                  height={match.homeTeamLogoUrl ? 48 : 32}
                  className={match.homeTeamLogoUrl ? "w-full h-full object-contain" : ""}
                />
              </div>
              <span className="text-sm font-medium">{match.homeTeam}</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground mb-1">VS</span>
              <Dialog open={showBetDialog} onOpenChange={setShowBetDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800">
                    Place Bet
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
                  <DialogHeader>
                    <DialogTitle>Place a Bet</DialogTitle>
                    <DialogDescription>
                      {match.homeTeam} vs {match.awayTeam}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <RadioGroup value={selectedOutcome || ""} onValueChange={setSelectedOutcome}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={match.homeTeam} id="home" />
                        <Label htmlFor="home" className="flex-1">
                          {match.homeTeam} <span className="text-amber-500 ml-2">({match.homeOdds})</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Draw" id="draw" />
                        <Label htmlFor="draw" className="flex-1">
                          Draw <span className="text-amber-500 ml-2">({match.drawOdds})</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={match.awayTeam} id="away" />
                        <Label htmlFor="away" className="flex-1">
                          {match.awayTeam} <span className="text-amber-500 ml-2">({match.awayOdds})</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    <Separator className="bg-zinc-800" />

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
                      <div className="text-xs text-muted-foreground">
                        Potential win:{" "}
                        {selectedOutcome === match.homeTeam
                          ? (Number.parseInt(betAmount) * Number.parseFloat(match.homeOdds)).toLocaleString()
                          : selectedOutcome === match.awayTeam
                            ? (Number.parseInt(betAmount) * Number.parseFloat(match.awayOdds)).toLocaleString()
                            : selectedOutcome === "Draw"
                              ? (Number.parseInt(betAmount) * Number.parseFloat(match.drawOdds)).toLocaleString()
                              : 0}{" "}
                        sats
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <TaprootEscrowExplainer />
                    </div>
                  </div>

                  {escrowStatus && (
                    <div className="mb-4 p-3 bg-amber-500/10 rounded-md border border-amber-500/20">
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

                  <DialogFooter>
                    <Button
                      onClick={handlePlaceBet}
                      disabled={isPlacingBet || !selectedOutcome}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    >
                      {isPlacingBet ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Pay with Lightning
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                <Image 
                  src={match.awayTeamLogoUrl || `/placeholder.svg?height=48&width=48`}
                  alt={match.awayTeam}
                  width={match.awayTeamLogoUrl ? 48 : 32}
                  height={match.awayTeamLogoUrl ? 48 : 32}
                  className={match.awayTeamLogoUrl ? "w-full h-full object-contain" : ""}
                />
              </div>
              <span className="text-sm font-medium">{match.awayTeam}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-zinc-800 text-center">
          <button className="py-2 hover:bg-zinc-800 transition-colors">
            <div className="text-sm font-medium">{match.homeOdds}</div>
            <div className="text-xs text-muted-foreground">Home</div>
          </button>
          <button className="py-2 border-x border-zinc-800 hover:bg-zinc-800 transition-colors">
            <div className="text-sm font-medium">{match.drawOdds}</div>
            <div className="text-xs text-muted-foreground">Draw</div>
          </button>
          <button className="py-2 hover:bg-zinc-800 transition-colors">
            <div className="text-sm font-medium">{match.awayOdds}</div>
            <div className="text-xs text-muted-foreground">Away</div>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

