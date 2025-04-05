import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Zap } from "lucide-react"

export function BettingGuide() {
  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          Betting Guide
        </CardTitle>
        <CardDescription>New to sports betting? Start here</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-zinc-800">
            <AccordionTrigger>How do odds work?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Odds represent the probability of an event happening and determine your potential payout. For example,
                odds of 2.00 mean you'll double your bet if you win.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-zinc-800">
            <AccordionTrigger>What is a spread bet?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                A spread bet is when you bet on a team to win by more than a specified number of points (the spread) or
                lose by less than the spread. For example, Lakers -5.5 means the Lakers need to win by 6 or more points.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-zinc-800">
            <AccordionTrigger>How do I place a bet?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                1. Connect your Lightning wallet
                <br />
                2. Select the match and outcome you want to bet on
                <br />
                3. Enter your bet amount
                <br />
                4. Confirm and pay the Lightning invoice
                <br />
                5. Your bet is placed instantly!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-zinc-800">
            <AccordionTrigger>How do I get paid?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Winnings are automatically sent to your Lightning wallet as soon as the event is settled. No withdrawal
                requests needed - it's instant and non-custodial!
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
          <Zap className="mr-2 h-4 w-4" />
          Start Betting
        </Button>
      </CardFooter>
    </Card>
  )
}

