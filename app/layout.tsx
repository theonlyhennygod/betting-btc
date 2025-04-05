import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { WalletAuthProvider } from "@/hooks/use-wallet-auth"
import Header from "@/components/header"
import { AnimatedTicker } from "@/components/animated-ticker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bolt Bets | Bitcoin Lightning Sports Betting",
  description: "Decentralized, non-custodial sports betting platform powered by Bitcoin Lightning Network",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <WalletAuthProvider>
            <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
              <Header />
              <AnimatedTicker />
              <main className="container mx-auto px-4 py-6">{children}</main>
              <Toaster />
            </div>
          </WalletAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'