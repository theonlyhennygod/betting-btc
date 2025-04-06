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
      <head>
        {/* Favicon Links */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        {/* Optional: Add theme color for PWA manifest */}
        {/* <meta name="msapplication-TileColor" content="#da532c"> */}
        {/* <meta name="theme-color" content="#ffffff"> */}
      </head>
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