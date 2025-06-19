"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Video,
  Mic,
  Settings,
  Coins,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Square,
} from "lucide-react"

interface User {
  address: string
  balance: number
  nfts: number
  followers: number
  following: number
  totalEarned: number
}

interface CreatorDashboardProps {
  user: User
  onBack: () => void
}

export default function CreatorDashboard({ user, onBack }: CreatorDashboardProps) {
  const [isLive, setIsLive] = useState(false)
  const [streamTitle, setStreamTitle] = useState("")
  const [streamDescription, setStreamDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Education")
  const [currentViewers, setCurrentViewers] = useState(0)
  const [sessionTips, setSessionTips] = useState(0)

  const categories = ["Gaming", "Education", "Art", "Music", "Finance", "Tech", "Lifestyle"]

  const startStream = () => {
    if (!streamTitle.trim()) return
    setIsLive(true)
    // Simulate viewers joining
    setTimeout(() => setCurrentViewers(Math.floor(Math.random() * 50) + 10), 2000)
  }

  const endStream = () => {
    setIsLive(false)
    setCurrentViewers(0)
    setSessionTips(0)
  }

  const streamStats = {
    totalStreams: 47,
    totalViewers: 12450,
    avgViewers: 265,
    totalTipsEarned: user.totalEarned,
    topStream: "Crypto Trading Masterclass",
    topStreamViewers: 1247,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex items-center gap-4">
              {isLive && (
                <Badge className="bg-red-600 text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  LIVE
                </Badge>
              )}
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">${user.balance.toFixed(2)} USDC</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stream Setup / Live View */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="w-6 h-6" />
                  {isLive ? "Live Stream" : "Stream Setup"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isLive ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Stream Title *</label>
                      <Input
                        placeholder="Enter your stream title..."
                        value={streamTitle}
                        onChange={(e) => setStreamTitle(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Description</label>
                      <Textarea
                        placeholder="Describe what you'll be streaming about..."
                        value={streamDescription}
                        onChange={(e) => setStreamDescription(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category} className="bg-gray-800">
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={startStream}
                        disabled={!streamTitle.trim()}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Go Live
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Live Stream Preview */}
                    <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center border-2 border-red-500/50">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📹</div>
                        <div className="text-white text-xl font-semibold mb-2">You're Live!</div>
                        <div className="text-gray-300">{streamTitle}</div>
                      </div>
                    </div>

                    {/* Live Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <Mic className="w-4 h-4 mr-2" />
                          Mute
                        </Button>
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <Video className="w-4 h-4 mr-2" />
                          Camera
                        </Button>
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </div>

                      <Button onClick={endStream} className="bg-red-600 hover:bg-red-700">
                        <Square className="w-4 h-4 mr-2" />
                        End Stream
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stream Analytics */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{streamStats.totalStreams}</div>
                    <div className="text-gray-300 text-sm">Total Streams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{streamStats.totalViewers.toLocaleString()}</div>
                    <div className="text-gray-300 text-sm">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{streamStats.avgViewers}</div>
                    <div className="text-gray-300 text-sm">Avg Viewers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">${streamStats.totalTipsEarned.toFixed(0)}</div>
                    <div className="text-gray-300 text-sm">Tips Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Stats */}
            {isLive && (
              <Card className="bg-white/10 border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-red-400" />
                    Live Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Current Viewers</span>
                    <span className="text-white font-semibold">{currentViewers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Session Tips</span>
                    <span className="text-yellow-400 font-semibold">${sessionTips}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Stream Duration</span>
                    <span className="text-white font-semibold">
                      {Math.floor(Math.random() * 60)}:
                      {Math.floor(Math.random() * 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Creator Stats */}
            <Card className="bg-white/10 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white">Creator Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Followers</span>
                  <span className="text-white font-semibold">{user.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Earned</span>
                  <span className="text-yellow-400 font-semibold">${user.totalEarned.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">NFTs Owned</span>
                  <span className="text-purple-400 font-semibold">{user.nfts}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/10 border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-white">+15 new followers</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-white">$125 in tips received</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-white">342 chat messages</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Share2 className="w-4 h-4 text-green-400" />
                  <span className="text-white">Stream shared 23 times</span>
                </div>
              </CardContent>
            </Card>

            {/* Top Performance */}
            <Card className="bg-white/10 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-white">Top Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-white font-semibold text-sm">{streamStats.topStream}</div>
                    <div className="text-gray-300 text-xs">
                      {streamStats.topStreamViewers.toLocaleString()} viewers • $450 tips
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Your most successful stream to date</div>
                </div>
              </CardContent>
            </Card>

            {/* Stream Tips */}
            <Card className="bg-white/10 border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-white">Creator Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-gray-300">💡 Engage with your chat regularly</div>
                <div className="text-gray-300">🎯 Set clear stream goals</div>
                <div className="text-gray-300">📅 Maintain a consistent schedule</div>
                <div className="text-gray-300">🎁 Reward loyal viewers with NFTs</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
