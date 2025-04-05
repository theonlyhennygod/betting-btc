"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Lock, Shield, Zap } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useTaprootEscrow } from "@/hooks/use-taproot-escrow"

interface Escrow {
  id: string
  status: "pending" | "active" | "completed" | "refunded" | "disputed"
  taprootAddress: string
  amount: number
  potentialWin: number
  createdAt: Date
  expiresAt: Date
  betDetails: {
    matchId: string
    matchName: string
    selectedOutcome: string
    odds: number
  }
  txid?: string
}

export function ActiveEscrows() {
  const [escrows, setEscrows] = useState<Escrow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { releaseEscrow, refundEscrow } = useTaprootEscrow()

  useEffect(() => {
    // In a real app, this would fetch the user's escrows from an API
    const fetchEscrows = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockEscrows: Escrow[] = [
        {
          id: "escrow_1",
          status: "active",
          taprootAddress: "bc1p9yfshqrpvx7zg7unwgxlj23frjhkcz9qxr8shdmhgq543xdwxzfqw7hkz3",
          amount: 50000,
          potentialWin: 125000,
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          expiresAt: new Date(Date.now() + 86400000), // 1 day from now
          betDetails: {
            matchId: "match_1",
            matchName: "Lakers vs Warriors",
            selectedOutcome: "Lakers",
            odds: 2.5,
          },
        },
        {
          id: "escrow_2",
          status: "pending",
          taprootAddress: "bc1p8z5vprg7wp8q3py5pzr3xrh6shelzg7amkr8xqgudtvqxn4xqj5sxu3q7e",
          amount: 25000,
          potentialWin: 43750,
          createdAt: new Date(Date.now() - 3600000), // 1 hour ago
          expiresAt: new Date(Date.now() + 172800000), // 2 days from now
          betDetails: {
            matchId: "match_2",
            matchName: "Manchester City vs Liverpool",
            selectedOutcome: "Draw",
            odds: 1.75,
          },
        },
        {
          id: "escrow_3",
          status: "completed",
          taprootAddress: "bc1pqypqxpq9qcrsszg2pvxq6rs0zqg3yyj5hk2k43ucsj3an5g46gkqwp0nrq",
          amount: 100000,
          potentialWin: 290000,
          createdAt: new Date(Date.now() - 259200000), // 3 days ago
          expiresAt: new Date(Date.now() - 86400000), // 1 day ago
          betDetails: {
            matchId: "match_3",
            matchName: "Chiefs vs Eagles",
            selectedOutcome: "Chiefs",
            odds: 2.9,
          },
          txid: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
        },
      ]

      setEscrows(mockEscrows)
      setIsLoading(false)
    }

    fetchEscrows()
  }, [])

  const handleReleaseEscrow = async (escrowId: string) => {
    try {
      const result = await releaseEscrow(escrowId)

      // Update the escrow in the list
      setEscrows((prev) =>
        prev.map((escrow) => (escrow.id === escrowId ? { ...escrow, status: "completed", txid: result.txid } : escrow)),
      )
    } catch (error) {
      console.error("Failed to release escrow:", error)
    }
  }

  const handleRefundEscrow = async (escrowId: string) => {
    try {
      const result = await refundEscrow(escrowId)

      // Update the escrow in the list
      setEscrows((prev) =>
        prev.map((escrow) => (escrow.id === escrowId ? { ...escrow, status: "refunded", txid: result.txid } : escrow)),
      )
    } catch (error) {
      console.error("Failed to refund escrow:", error)
    }
  }

  const getStatusBadge = (status: Escrow["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            Pending
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Active
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Completed
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Refunded
          </Badge>
        )
      case "disputed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Disputed
          </Badge>
        )
    }
  }

  return (
    <Card className="bg-black/40 border-zinc-800">
      <CardHeader>
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-amber-500" />
          <div>
            <CardTitle>Taproot Escrows</CardTitle>
            <CardDescription>Your active and past bets secured by Taproot</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Loading escrows...</div>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all">All ({escrows.length})</TabsTrigger>
              <TabsTrigger value="active">
                Active ({escrows.filter((e) => e.status === "active" || e.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({escrows.filter((e) => e.status === "completed").length})
              </TabsTrigger>
              <TabsTrigger value="other">
                Other ({escrows.filter((e) => e.status === "refunded" || e.status === "disputed").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {escrows.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No escrows found</p>
                  </div>
                ) : (
                  escrows.map((escrow) => (
                    <div key={escrow.id} className="p-4 rounded-lg border border-zinc-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{escrow.betDetails.matchName}</div>
                          <div className="text-sm text-muted-foreground">
                            Bet on: {escrow.betDetails.selectedOutcome}
                          </div>
                        </div>
                        {getStatusBadge(escrow.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Amount</div>
                          <div className="font-medium">{escrow.amount.toLocaleString()} sats</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Potential Win</div>
                          <div className="font-medium text-amber-500">{escrow.potentialWin.toLocaleString()} sats</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Created</div>
                          <div>{formatDate(escrow.createdAt.toISOString())}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Expires</div>
                          <div>{formatDate(escrow.expiresAt.toISOString())}</div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground break-all">
                        <span className="font-medium">Taproot address:</span> {escrow.taprootAddress}
                      </div>

                      {escrow.txid && (
                        <div className="text-xs flex items-center">
                          <span className="font-medium mr-1">Transaction:</span>
                          <a
                            href={`https://mempool.space/tx/${escrow.txid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-500 hover:text-amber-400 flex items-center"
                          >
                            {escrow.txid.substring(0, 8)}...{escrow.txid.substring(escrow.txid.length - 8)}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      )}

                      {(escrow.status === "active" || escrow.status === "pending") && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-700 text-xs"
                            onClick={() => handleReleaseEscrow(escrow.id)}
                          >
                            <Zap className="h-3 w-3 mr-1 text-amber-500" />
                            Release Funds
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-700 text-xs"
                            onClick={() => handleRefundEscrow(escrow.id)}
                          >
                            <Lock className="h-3 w-3 mr-1 text-amber-500" />
                            Refund
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="space-y-4">
                {escrows.filter((e) => e.status === "active" || e.status === "pending").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No active escrows found</p>
                  </div>
                ) : (
                  escrows
                    .filter((e) => e.status === "active" || e.status === "pending")
                    .map((escrow) => (
                      <div key={escrow.id} className="p-4 rounded-lg border border-zinc-800 space-y-3">
                        {/* Same content as above */}
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{escrow.betDetails.matchName}</div>
                            <div className="text-sm text-muted-foreground">
                              Bet on: {escrow.betDetails.selectedOutcome}
                            </div>
                          </div>
                          {getStatusBadge(escrow.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">Amount</div>
                            <div className="font-medium">{escrow.amount.toLocaleString()} sats</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Potential Win</div>
                            <div className="font-medium text-amber-500">
                              {escrow.potentialWin.toLocaleString()} sats
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Created</div>
                            <div>{formatDate(escrow.createdAt.toISOString())}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Expires</div>
                            <div>{formatDate(escrow.expiresAt.toISOString())}</div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground break-all">
                          <span className="font-medium">Taproot address:</span> {escrow.taprootAddress}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-700 text-xs"
                            onClick={() => handleReleaseEscrow(escrow.id)}
                          >
                            <Zap className="h-3 w-3 mr-1 text-amber-500" />
                            Release Funds
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-zinc-700 text-xs"
                            onClick={() => handleRefundEscrow(escrow.id)}
                          >
                            <Lock className="h-3 w-3 mr-1 text-amber-500" />
                            Refund
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              {/* Similar content for completed escrows */}
              <div className="space-y-4">
                {escrows.filter((e) => e.status === "completed").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No completed escrows found</p>
                  </div>
                ) : (
                  escrows
                    .filter((e) => e.status === "completed")
                    .map((escrow) => (
                      <div key={escrow.id} className="p-4 rounded-lg border border-zinc-800 space-y-3">
                        {/* Simplified content for completed escrows */}
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{escrow.betDetails.matchName}</div>
                            <div className="text-sm text-muted-foreground">
                              Bet on: {escrow.betDetails.selectedOutcome}
                            </div>
                          </div>
                          {getStatusBadge(escrow.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">Amount</div>
                            <div className="font-medium">{escrow.amount.toLocaleString()} sats</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Won</div>
                            <div className="font-medium text-amber-500">
                              {escrow.potentialWin.toLocaleString()} sats
                            </div>
                          </div>
                        </div>

                        {escrow.txid && (
                          <div className="text-xs flex items-center">
                            <span className="font-medium mr-1">Transaction:</span>
                            <a
                              href={`https://mempool.space/tx/${escrow.txid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-500 hover:text-amber-400 flex items-center"
                            >
                              {escrow.txid.substring(0, 8)}...{escrow.txid.substring(escrow.txid.length - 8)}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="other">
              {/* Similar content for other escrows */}
              <div className="space-y-4">
                {escrows.filter((e) => e.status === "refunded" || e.status === "disputed").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No refunded or disputed escrows found</p>
                  </div>
                ) : (
                  escrows
                    .filter((e) => e.status === "refunded" || e.status === "disputed")
                    .map((escrow) => (
                      <div key={escrow.id} className="p-4 rounded-lg border border-zinc-800 space-y-3">
                        {/* Simplified content for other escrows */}
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{escrow.betDetails.matchName}</div>
                            <div className="text-sm text-muted-foreground">
                              Bet on: {escrow.betDetails.selectedOutcome}
                            </div>
                          </div>
                          {getStatusBadge(escrow.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-muted-foreground">Amount</div>
                            <div className="font-medium">{escrow.amount.toLocaleString()} sats</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Status</div>
                            <div className="font-medium">
                              {escrow.status === "refunded" ? "Refunded" : "In Dispute"}
                            </div>
                          </div>
                        </div>

                        {escrow.txid && (
                          <div className="text-xs flex items-center">
                            <span className="font-medium mr-1">Transaction:</span>
                            <a
                              href={`https://mempool.space/tx/${escrow.txid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-500 hover:text-amber-400 flex items-center"
                            >
                              {escrow.txid.substring(0, 8)}...{escrow.txid.substring(escrow.txid.length - 8)}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

