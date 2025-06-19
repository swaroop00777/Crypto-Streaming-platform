"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  UserIcon,
  Coins,
  Gift,
  Users,
  Settings,
  Edit,
  Copy,
  ExternalLink,
  Trophy,
  Calendar,
  TrendingUp,
} from "lucide-react"

interface UserType {
  address: string
  balance: number
  nfts: number
  followers: number
  following: number
  totalEarned: number
}

interface UserProfileProps {
  user: UserType
  onBack: () => void
}

interface NFT {
  id: string
  name: string
  type: string
  rarity: "common" | "rare" | "epic" | "legendary"
  image: string
  earned: string
}

export default function UserProfile({ user, onBack }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "nfts" | "settings">("overview")
  const [displayName, setDisplayName] = useState("Crypto Creator")
  const [bio, setBio] = useState("Passionate about DeFi and blockchain technology. Streaming daily to share knowledge!")

  // Mock NFT collection
  const nftCollection: NFT[] = [
    {
      id: "1",
      name: "Early Supporter",
      type: "Badge",
      rarity: "rare",
      image: "/placeholder.svg?height=100&width=100",
      earned: "First week user",
    },
    {
      id: "2",
      name: "Generous Tipper",
      type: "Achievement",
      rarity: "epic",
      image: "/placeholder.svg?height=100&width=100",
      earned: "Tipped $100+ total",
    },
    {
      id: "3",
      name: "Stream Supporter",
      type: "Badge",
      rarity: "common",
      image: "/placeholder.svg?height=100&width=100",
      earned: "Watched 10+ streams",
    },
    {
      id: "4",
      name: "Community Champion",
      type: "Achievement",
      rarity: "legendary",
      image: "/placeholder.svg?height=100&width=100",
      earned: "Top 1% supporter",
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/10"
      case "epic":
        return "text-purple-400 border-purple-400 bg-purple-400/10"
      case "rare":
        return "text-blue-400 border-blue-400 bg-blue-400/10"
      default:
        return "text-gray-400 border-gray-400 bg-gray-400/10"
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(user.address)
    // Could add toast notification here
  }

  const achievements = [
    { name: "First Stream", description: "Watched your first stream", unlocked: true },
    { name: "Generous Supporter", description: "Sent $50+ in tips", unlocked: true },
    { name: "Community Member", description: "Active for 30+ days", unlocked: true },
    { name: "NFT Collector", description: "Own 10+ NFTs", unlocked: user.nfts >= 10 },
    { name: "Top Supporter", description: "Top 5% tipper", unlocked: false },
  ]

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
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">${user.balance.toFixed(2)} USDC</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-white/10 border-white/20 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl">
                👤
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{displayName}</h1>
                  <Button size="sm" variant="outline" className="text-white border-white/30">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-300 font-mono text-sm">{user.address}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyAddress}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-gray-300 mb-4 max-w-2xl">{bio}</p>

                <div className="flex items-center gap-6">
                  <Badge className="bg-purple-600 text-white">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined Dec 2024
                  </Badge>
                  <div className="flex items-center gap-1 text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{user.followers.toLocaleString()} followers</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <span>{user.following.toLocaleString()} following</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 border-yellow-400/30">
            <CardContent className="p-6 text-center">
              <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">${user.totalEarned.toFixed(0)}</div>
              <div className="text-gray-300">Total Earned</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-purple-400/30">
            <CardContent className="p-6 text-center">
              <Gift className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">{user.nfts}</div>
              <div className="text-gray-300">NFTs Owned</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-blue-400/30">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">{user.followers.toLocaleString()}</div>
              <div className="text-gray-300">Followers</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-green-400/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">#{Math.floor(Math.random() * 1000) + 1}</div>
              <div className="text-gray-300">Global Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          {[
            { id: "overview", label: "Overview", icon: UserIcon },
            { id: "nfts", label: "NFT Collection", icon: Gift },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={activeTab === tab.id ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white"}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center">
                    <Coins className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">Sent $25 tip to CryptoGuru</div>
                    <div className="text-gray-400 text-sm">2 hours ago</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">Earned "Generous Tipper" NFT</div>
                    <div className="text-gray-400 text-sm">1 day ago</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">Followed DigitalArtist</div>
                    <div className="text-gray-400 text-sm">3 days ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        achievement.unlocked
                          ? "bg-green-600/20 border border-green-400/30"
                          : "bg-gray-600/20 border border-gray-400/30"
                      }`}
                    >
                      <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>🏆</div>
                      <div className="flex-1">
                        <div className={`font-semibold ${achievement.unlocked ? "text-white" : "text-gray-400"}`}>
                          {achievement.name}
                        </div>
                        <div className={`text-sm ${achievement.unlocked ? "text-green-200" : "text-gray-500"}`}>
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.unlocked && <Badge className="bg-green-600 text-white">Unlocked</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "nfts" && (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-purple-400" />
                NFT Collection ({nftCollection.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nftCollection.map((nft) => (
                  <div
                    key={nft.id}
                    className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <div className="text-center">
                      <h3 className="text-white font-semibold mb-1">{nft.name}</h3>
                      <Badge className={`text-xs mb-2 ${getRarityColor(nft.rarity)}`}>{nft.rarity}</Badge>
                      <div className="text-gray-400 text-xs">{nft.earned}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Display Name</label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                </div>

                <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Wallet Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Connected Wallet</div>
                    <div className="text-gray-400 text-sm font-mono">{user.address}</div>
                  </div>
                  <Button variant="outline" className="text-white border-white/30">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <Button
                    variant="outline"
                    className="text-red-400 border-red-400 hover:bg-red-400/10 hover:border-red-500"
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
