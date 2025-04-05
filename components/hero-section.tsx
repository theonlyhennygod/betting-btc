import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-black/40 px-6 py-12 md:px-12 md:py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-600/5" />
      <div className="relative max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          <span className="block text-amber-500">Bitcoin-Native</span>
          <span className="block">Sports Betting</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Place micro-bets with Lightning Network, get instant payouts, and enjoy a censorship-resistant betting
          experience with no KYC.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            <Zap className="mr-2 h-4 w-4" />
            Start Betting
          </Button>
          <Button size="lg" variant="outline" className="border-zinc-700">
            Learn How It Works
          </Button>
        </div>
      </div>
      <div className="absolute -bottom-24 -right-24 h-[300px] w-[300px] rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute -top-24 -left-24 h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-3xl" />
    </div>
  )
}

