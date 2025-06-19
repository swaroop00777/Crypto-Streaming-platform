"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Medal, Award } from "lucide-react"

interface User {
  address: string
  balance: number
  nfts: NFT[]
  wins: number
  losses: number
  rank: number
}

interface NFT {
  id: string
  name: string
  type: "jersey" | "ball" | "boots" | "gloves"
  rarity: "common" | "rare" | "epic" | "legendary"
  image: string
}

interface LeaderboardProps {
  user: User
  onBack: () => void
}

interface LeaderboardPlayer {
  rank: number
  address: string
  wins: number
  losses: number
  winRate: number
  tokens: number
  isCurrentUser?: boolean
}

export default function Leaderboard({ user, onBack }: LeaderboardProps) {
  // Mock leaderboard data
  const leaderboardData: LeaderboardPlayer[] = [
    { rank: 1, address: "0x1234...5678", wins: 89, losses: 11, winRate: 89.0, tokens: 2450 },
    { rank: 2, address: "0x2345...6789", wins: 76, losses: 14, winRate: 84.4, tokens: 2100 },
    { rank: 3, address: "0x3456...7890", wins: 68, losses: 17, winRate: 80.0, tokens: 1890 },
    { rank: 4, address: "0x4567...8901", wins: 62, losses: 18, winRate: 77.5, tokens: 1750 },
    { rank: 5, address: "0x5678...9012", wins: 58, losses: 22, winRate: 72.5, tokens: 1620 },
    { rank: 6, address: "0x6789...0123", wins: 54, losses: 26, winRate: 67.5, tokens: 1480 },
    { rank: 7, address: "0x7890...1234", wins: 49, losses: 31, winRate: 61.3, tokens: 1350 },
    { rank: 8, address: "0x8901...2345", wins: 45, losses: 35, winRate: 56.3, tokens: 1220 },
    { rank: 9, address: "0x9012...3456", wins: 41, losses: 39, winRate: 51.3, tokens: 1100 },
    { rank: 10, address: "0x0123...4567", wins: 38, losses: 42, winRate: 47.5, tokens: 980 },
  ]

  // Add current user to leaderboard
  const currentUserData: LeaderboardPlayer = {
    rank: user.rank,
    address: user.address,
    wins: user.wins,
    losses: user.losses,
    winRate: user.wins + user.losses > 0 ? (user.wins / (user.wins + user.losses)) * 100 : 0,
    tokens: user.balance,
    isCurrentUser: true,
  }

  // Insert current user if not in top 10
  let displayData = [...leaderboardData]
  if (user.rank > 10) {
    displayData = [...leaderboardData, currentUserData]
  } else {
    displayData[user.rank - 1] = currentUserData
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-white">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-amber-600"
    }
    return "bg-green-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="text-white border-white/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Global Leaderboard</h1>
        </div>

        {/* Season Info */}
        <Card className="bg-white/10 border-green-400/30 mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Season 1 - December 2024</h2>
                <p className="text-green-200">Compete for exclusive NFT rewards and climb the ranks!</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400">15 days left</div>
                <p className="text-green-200 text-sm">Season ends</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {displayData.slice(0, 3).map((player, index) => (
            <Card
              key={player.rank}
              className={`${
                player.isCurrentUser ? "bg-blue-600/20 border-blue-400" : "bg-white/10 border-green-400/30"
              } ${index === 0 ? "md:order-2 transform md:scale-110" : index === 1 ? "md:order-1" : "md:order-3"}`}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">{getRankIcon(player.rank)}</div>
                <div className="font-mono text-sm text-green-200 mb-2">
                  {player.address.slice(0, 6)}...{player.address.slice(-4)}
                </div>
                <div className="text-2xl font-bold text-white mb-2">{player.wins}W</div>
                <div className="text-green-200 text-sm mb-2">{player.winRate.toFixed(1)}% win rate</div>
                <Badge className={`${getRankBadge(player.rank)} text-white`}>{player.tokens} PEN</Badge>
                {player.isCurrentUser && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      You
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card className="bg-white/10 border-green-400/30">
          <CardHeader>
            <CardTitle className="text-white">Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {displayData.map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    player.isCurrentUser ? "bg-blue-600/20 border border-blue-400/50" : "bg-white/5 hover:bg-white/10"
                  } transition-colors`}
                >
                  <div className="w-12 flex justify-center">{getRankIcon(player.rank)}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white">
                        {player.address.slice(0, 8)}...{player.address.slice(-6)}
                      </span>
                      {player.isCurrentUser && (
                        <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-center min-w-20">
                    <div className="text-white font-semibold">{player.wins}W</div>
                    <div className="text-green-200 text-sm">{player.losses}L</div>
                  </div>

                  <div className="text-center min-w-20">
                    <div className="text-white font-semibold">{player.winRate.toFixed(1)}%</div>
                    <div className="text-green-200 text-sm">Win Rate</div>
                  </div>

                  <div className="text-center min-w-24">
                    <div className="text-yellow-400 font-semibold">{player.tokens}</div>
                    <div className="text-green-200 text-sm">PEN</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Season Rewards Preview */}
        <Card className="bg-white/10 border-yellow-400/30 mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Season End Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
                <div className="text-3xl mb-2">🥇</div>
                <div className="text-white font-semibold">1st Place</div>
                <div className="text-yellow-400 text-sm">Legendary Champion NFT + 1000 PEN</div>
              </div>
              <div className="text-center p-4 bg-gray-400/20 rounded-lg">
                <div className="text-3xl mb-2">🥈</div>
                <div className="text-white font-semibold">2nd Place</div>
                <div className="text-gray-300 text-sm">Epic Runner-up NFT + 500 PEN</div>
              </div>
              <div className="text-center p-4 bg-amber-600/20 rounded-lg">
                <div className="text-3xl mb-2">🥉</div>
                <div className="text-white font-semibold">3rd Place</div>
                <div className="text-amber-400 text-sm">Rare Bronze NFT + 250 PEN</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
