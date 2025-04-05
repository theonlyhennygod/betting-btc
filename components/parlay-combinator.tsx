"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Calculator, Trash2, Zap } from "lucide-react"
import { parlayOptions } from "@/lib/fixtures"

interface ParlaySelection {
  id: string
  title: string
  odds: number
  selected: boolean
}

export function ParlayCombinator() {
  const { toast } = useToast()
  const [selections, setSelections] = useState<ParlaySelection[]>(
    parlayOptions.map((option) => ({ ...option, selected: false })),
  )
  const [betAmount, setBetAmount] = useState("10000")

  const selectedSelections = selections.filter((s) => s.selected)
  const totalOdds = selectedSelections.reduce((acc, curr) => acc * curr.odds, 1)
  const potentialWin = Number.parseInt(betAmount) * totalOdds

  const handleToggleSelection = (id: string) => {
    setSelections((prev) =>
      prev.map((selection) => (selection.id === id ? { ...selection, selected: !selection.selected } : selection)),
    )
  }

  const handleClearSelections = () => {
    setSelections((prev) => prev.map((selection) => ({ ...selection, selected: false })))
  }

  const handlePlaceBet = () => {
    if (selectedSelections.length < 2) {
      toast({
        variant: "destructive",
        title: "Not enough selections",
        description: "A parlay requires at least 2 selections",
      })
      return
    }

    toast({
      title: "Parlay bet placed!",
      description: `${selectedSelections.length} selections with total odds of ${totalOdds.toFixed(2)}`,
    })
  }

  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardHeader>
        <CardTitle>Parlay Builder</CardTitle>
        <CardDescription>Combine multiple bets for bigger payouts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {selections.map((selection) => (
            <div
              key={selection.id}
              className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                selection.selected ? "border-amber-500/50 bg-amber-500/5" : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={selection.id}
                  checked={selection.selected}
                  onCheckedChange={() => handleToggleSelection(selection.id)}
                />
                <Label htmlFor={selection.id} className="text-sm cursor-pointer">
                  {selection.title}
                </Label>
              </div>
              <div className="text-sm font-medium">{selection.odds.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <Separator className="bg-zinc-800" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Selections</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedSelections.length}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 border-zinc-700"
                onClick={handleClearSelections}
                disabled={selectedSelections.length === 0}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Clear selections</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Total Odds</span>
            <span className="text-sm font-medium">{totalOdds.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parlay-amount">Bet Amount (sats)</Label>
            <div className="flex items-center">
              <Input
                id="parlay-amount"
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
            <span className="text-sm font-medium text-amber-500">{potentialWin.toLocaleString()} sats</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          disabled={selectedSelections.length < 2}
          onClick={handlePlaceBet}
        >
          <Zap className="mr-2 h-4 w-4" />
          Place Parlay Bet
        </Button>
      </CardFooter>
    </Card>
  )
}

