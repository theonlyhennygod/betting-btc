"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Lock, Shield } from "lucide-react"

export function TaprootEscrowExplainer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
        >
          <Shield className="h-3 w-3 mr-1 text-amber-500" />
          Protected by Taproot Escrow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2 text-amber-500" />
            Taproot Escrow Protection
          </DialogTitle>
          <DialogDescription>
            Your bets are secured by Bitcoin&apos;s Taproot technology
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">How it works:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start">
                <span className="bg-amber-500/20 text-amber-500 rounded-full px-2 py-0.5 text-xs mr-2 mt-0.5">
                  1
                </span>
                <span>
                  Your bet is locked in a Taproot escrow contract on the Bitcoin blockchain
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-500/20 text-amber-500 rounded-full px-2 py-0.5 text-xs mr-2 mt-0.5">
                  2
                </span>
                <span>
                  Funds can only be released when the match outcome is verified by our oracle network
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-500/20 text-amber-500 rounded-full px-2 py-0.5 text-xs mr-2 mt-0.5">
                  3
                </span>
                <span>
                  If you win, the smart contract automatically releases your winnings to your wallet
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-500/20 text-amber-500 rounded-full px-2 py-0.5 text-xs mr-2 mt-0.5">
                  4
                </span>
                <span>
                  If the match is cancelled or there&apos;s a dispute, your funds are automatically returned
                </span>
              </li>
            </ul>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>
              Taproot is Bitcoin&apos;s latest upgrade that enables more private and efficient smart contracts,
              making your bets more secure than ever.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 