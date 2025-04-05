"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Gift, X, Zap } from "lucide-react"
import Link from "next/link"

export function ReferralNotification() {
  const [show, setShow] = useState(false)

  // Simulate a notification appearing after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Card className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-amber-500/30 shadow-lg">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-full">
              <Gift className="h-5 w-5 text-amber-500" />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">Earn Bitcoin Rewards!</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={() => setShow(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                Invite friends and earn 10,000 sats for each referral. They'll get a bonus too!
              </p>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  asChild
                >
                  <Link href="/referrals">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Get Referral Link
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="border-zinc-700" onClick={() => setShow(false)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

