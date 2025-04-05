"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  ShoppingBasketIcon as Basketball,
  ClubIcon as Football,
  BeerIcon as Baseball,
  ClubIcon as Soccer,
  TurtleIcon as Tennis,
  GuitarIcon as Golf,
  BoxIcon as Boxing,
  Trophy,
  Dumbbell,
} from "lucide-react"
import Link from "next/link"

interface SportCategory {
  id: string
  name: string
  icon: React.ReactNode
  active?: boolean
}

export function SportsHeader() {
  const [activeCategory, setActiveCategory] = useState("all")

  const sportCategories: SportCategory[] = [
    {
      id: "all",
      name: "All Sports",
      icon: <Trophy className="h-4 w-4" />,
      active: activeCategory === "all",
    },
    {
      id: "nba",
      name: "NBA",
      icon: <Basketball className="h-4 w-4" />,
      active: activeCategory === "nba",
    },
    {
      id: "nfl",
      name: "NFL",
      icon: <Football className="h-4 w-4" />,
      active: activeCategory === "nfl",
    },
    {
      id: "mlb",
      name: "MLB",
      icon: <Baseball className="h-4 w-4" />,
      active: activeCategory === "mlb",
    },
    {
      id: "soccer",
      name: "Soccer",
      icon: <Soccer className="h-4 w-4" />,
      active: activeCategory === "soccer",
    },
    {
      id: "tennis",
      name: "Tennis",
      icon: <Tennis className="h-4 w-4" />,
      active: activeCategory === "tennis",
    },
    {
      id: "golf",
      name: "Golf",
      icon: <Golf className="h-4 w-4" />,
      active: activeCategory === "golf",
    },
    {
      id: "ufc",
      name: "UFC/MMA",
      icon: <Boxing className="h-4 w-4" />,
      active: activeCategory === "ufc",
    },
    {
      id: "other",
      name: "Other Sports",
      icon: <Dumbbell className="h-4 w-4" />,
      active: activeCategory === "other",
    },
  ]

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  return (
    <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2">
          {sportCategories.map((category) => (
            <Button
              key={category.id}
              variant={category.active ? "default" : "outline"}
              size="sm"
              className={
                category.active
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  : "border-zinc-700"
              }
              onClick={() => handleCategoryChange(category.id)}
              asChild
            >
              <Link href={category.id === "all" ? "/sports" : `/sports/${category.id}`}>
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </Link>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

