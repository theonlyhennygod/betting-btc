import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SportsHeader } from "@/components/sports-header"
import { SportsBettingSection } from "@/components/sports-betting-section"
import { FeaturedBets } from "@/components/featured-bets"
import { BettingGuide } from "@/components/betting-guide"
import { ReferralBanner } from "@/components/referral-banner"
import { ReferralNotification } from "@/components/referral-notification"

export default function SportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sports Betting</h1>

      <ReferralBanner />

      <SportsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              <TabsTrigger value="futures">Futures</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-4">
              <SportsBettingSection />
            </TabsContent>
            <TabsContent value="today" className="space-y-4 mt-4">
              <SportsBettingSection filter="today" />
            </TabsContent>
            <TabsContent value="tomorrow" className="space-y-4 mt-4">
              <SportsBettingSection filter="tomorrow" />
            </TabsContent>
            <TabsContent value="futures" className="space-y-4 mt-4">
              <SportsBettingSection filter="futures" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <FeaturedBets />
          <BettingGuide />
        </div>
      </div>

      <ReferralNotification />
    </div>
  )
}

