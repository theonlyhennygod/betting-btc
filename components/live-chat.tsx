"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { useToast } from "@/components/ui/use-toast"
import { Send, Zap } from "lucide-react"

interface ChatMessage {
  id: string
  user: {
    name: string
    avatar?: string
  }
  content: string
  timestamp: Date
  tip?: number
}

interface LiveChatProps {
  matchId: string
}

export function LiveChat({ matchId }: LiveChatProps) {
  const { isAuthenticated } = useWalletAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Generate initial messages
  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        id: "1",
        user: { name: "BitcoinBob" },
        content: "Let's go Lakers! 🏀",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
      {
        id: "2",
        user: { name: "SatoshiSam" },
        content: "This game is intense!",
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
      },
      {
        id: "3",
        user: { name: "LightningLucy" },
        content: "Just placed a bet on the Celtics to win",
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        tip: 1000,
      },
      {
        id: "4",
        user: { name: "NodeRunner" },
        content: "That last play was incredible",
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
      },
      {
        id: "5",
        user: { name: "TaprootTom" },
        content: "Anyone else betting on the over?",
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
      },
    ]

    setMessages(initialMessages)
  }, [matchId])

  // Simulate new messages coming in
  useEffect(() => {
    const botMessages = [
      "What a game!",
      "Did you see that play?",
      "I think they'll score again soon",
      "The defense is looking solid",
      "This ref is making some questionable calls",
      "I just won 50k sats on that last bet!",
      "Who's watching from Europe?",
      "Lightning payments are so fast ⚡",
    ]

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomBotMessage = botMessages[Math.floor(Math.random() * botMessages.length)]
        const botNames = [
          "BitcoinBob",
          "SatoshiSam",
          "LightningLucy",
          "NodeRunner",
          "TaprootTom",
          "BlockchainBill",
          "HashratePete",
        ]
        const randomName = botNames[Math.floor(Math.random() * botNames.length)]

        const newBotMessage: ChatMessage = {
          id: Date.now().toString(),
          user: { name: randomName },
          content: randomBotMessage,
          timestamp: new Date(),
          tip: Math.random() > 0.8 ? Math.floor(Math.random() * 5000) + 500 : undefined,
        }

        setMessages((prev) => [...prev, newBotMessage])
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please connect your Lightning wallet to chat",
      })
      return
    }

    setIsSending(true)

    // Simulate sending message
    setTimeout(() => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        user: { name: "You" },
        content: newMessage.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setNewMessage("")
      setIsSending(false)
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle>Live Chat</CardTitle>
        <CardDescription>Chat with other bettors</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.user.avatar} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-300">
                    {message.user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{message.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }).format(message.timestamp)}
                    </span>
                    {message.tip && (
                      <span className="flex items-center text-xs text-amber-500">
                        <Zap className="h-3 w-3 mr-0.5" />
                        {message.tip.toLocaleString()} sats
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending || !isAuthenticated}
            className="bg-zinc-800 border-zinc-700"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={isSending || !newMessage.trim() || !isAuthenticated}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

