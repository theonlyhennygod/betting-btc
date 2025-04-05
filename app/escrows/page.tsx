"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"
import { ActiveEscrows } from "@/components/active-escrows"
import { TaprootEscrowExplainer } from "@/components/taproot-escrow-explainer"

export default function EscrowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 border-zinc-700" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Shield className="h-5 w-5 mr-2 text-amber-500" />
              Taproot Escrows
            </h1>
            <p className="text-muted-foreground">Manage your secure Bitcoin escrows</p>
          </div>
        </div>

        <TaprootEscrowExplainer />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ActiveEscrows />
      </div>
    </div>
  )
}

