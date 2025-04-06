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
  title: "Bit Bet | Bitcoin Lightning Sports Betting",
  description: "Decentralized, non-custodial sports betting platform powered by Bitcoin Lightning Network",
  keywords: "bitcoin, lightning network, sports betting, decentralized betting, non-custodial, crypto betting",
  authors: [{ name: "Bit Bet" }],
  openGraph: {
    title: "Bit Bet | Bitcoin Lightning Sports Betting",
    description: "Decentralized, non-custodial sports betting platform powered by Bitcoin Lightning Network",
    type: "website",
    locale: "en_US",
    siteName: "Bit Bet",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bit Bet | Bitcoin Lightning Sports Betting",
    description: "Decentralized, non-custodial sports betting platform powered by Bitcoin Lightning Network",
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
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