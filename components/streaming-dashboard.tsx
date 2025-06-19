"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Wallet,
  Play,
  Users,
  Coins,
  Gift,
  Settings,
  Search,
  Video,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
} from "lucide-react"
import StreamViewer from "@/components/stream-viewer"
import CreatorDashboard from "@/components/creator-dashboard"
import UserProfile from "@/components/user-profile"

interface StreamingDashboardProps {
  onBack: () => void
}

interface User {
  address: string
  balance: number
  nfts: number
  followers: number
  following: number
  totalEarned: number
}

interface Stream {
  id: string
  title: string
  creator: string
  viewers: number
  category: string
  thumbnail: string
  isLive: boolean
  tips: number
}

type DashboardView = "home" | "stream" | "create" | "profile"

export default function StreamingDashboard({ onBack }: StreamingDashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("home")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock streams data
  const featuredStreams: Stream[] = [
    {
      id: "1",
      title: "Crypto Trading Masterclass - Live Analysis",
      creator: "CryptoGuru",
      viewers: 1247,
      category: "Education",
      thumbnail: "/placeholder.svg?height=200&width=300",
      isLive: true,
      tips: 450,
    },
    {
      id: "2",
      title: "NFT Art Creation Process",
      creator: "DigitalArtist",
      viewers: 892,
      category: "Art",
      thumbnail: "/placeholder.svg?height=200&width=300",
      isLive: true,
      tips: 320,
    },
    {
      id: "3",
      title: "DeFi Yield Farming Strategies",
      creator: "DeFiExpert",
      viewers: 634,
      category: "Finance",
      thumbnail: "/placeholder.svg?height=200&width=300",
      isLive: true,
      tips: 280,
    },
    {
      id: "4",
      title: "Gaming with Crypto Rewards",
      creator: "GameStreamer",
      viewers: 1156,
      category: "Gaming",
      thumbnail: "/placeholder.svg?height=200&width=300",
      isLive: true,
      tips: 380,
    },
  ]

  const connectWallet = async () => {
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockUser: User = {
      address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
      balance: 1250.5,
      nfts: 12,
      followers: 1456,
      following: 234,
      totalEarned: 3420.75,
    }

    setUser(mockUser)
    setIsWalletConnected(true)
  }

  const watchStream = (stream: Stream) => {
    setSelectedStream(stream)
    setCurrentView("stream")
  }

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-8 text-white border-white/30 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Landing
          </Button>

          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Connect Your Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl mb-4">🔗</div>
              <p className="text-gray-300">
                Connect your Web3 wallet to access StreamBlock and start earning USDC tips and NFT rewards.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={connectWallet}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect MetaMask
                </Button>

                <Button
                  variant="outline"
                  className="w-full text-white border-white/30 hover:bg-white/10 hover:border-white/50 hover:text-white"
                  disabled
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  WalletConnect (Coming Soon)
                </Button>
              </div>

              <p className="text-sm text-gray-400">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === "stream" && selectedStream) {
    return <StreamViewer stream={selectedStream} user={user!} onBack={() => setCurrentView("home")} />
  }

  if (currentView === "create") {
    return <CreatorDashboard user={user!} onBack={() => setCurrentView("home")} />
  }

  if (currentView === "profile") {
    return <UserProfile user={user!} onBack={() => setCurrentView("home")} />
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                StreamBlock
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search streams, creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">${user?.balance.toFixed(2)} USDC</span>
              </div>

              <Button
                onClick={() => setCurrentView("create")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                <Video className="w-4 h-4 mr-2" />
                Go Live
              </Button>

              <Button
                variant="ghost"
                onClick={() => setCurrentView("profile")}
                className="text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-purple-400/30">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{user?.followers.toLocaleString()}</div>
              <div className="text-gray-300 text-sm">Followers</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">${user?.totalEarned.toFixed(0)}</div>
              <div className="text-gray-300 text-sm">Total Earned</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-green-400/30">
            <CardContent className="p-4 text-center">
              <Gift className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{user?.nfts}</div>
              <div className="text-gray-300 text-sm">NFTs Owned</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-orange-400/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">#{Math.floor(Math.random() * 1000) + 1}</div>
              <div className="text-gray-300 text-sm">Global Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Streams */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">🔥 Trending Streams</h2>
            <Badge className="bg-red-600 text-white">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              LIVE
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStreams.map((stream) => (
              <Card
                key={stream.id}
                className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer group"
                onClick={() => watchStream(stream)}
              >
                <div className="relative">
                  <img
                    src={stream.thumbnail || "/placeholder.svg"}
                    alt={stream.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-600 text-white text-xs">
                      <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
                      LIVE
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/60 text-white text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {stream.viewers.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-t-lg flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">{stream.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{stream.creator}</span>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {stream.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Coins className="w-3 h-3" />
                      <span>${stream.tips}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      <Share2 className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {["Gaming", "Education", "Art", "Music", "Finance", "Tech"].map((category) => (
              <Card
                key={category}
                className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">
                    {category === "Gaming" && "🎮"}
                    {category === "Education" && "📚"}
                    {category === "Art" && "🎨"}
                    {category === "Music" && "🎵"}
                    {category === "Finance" && "💰"}
                    {category === "Tech" && "💻"}
                  </div>
                  <div className="text-white font-semibold">{category}</div>
                  <div className="text-gray-400 text-sm">{Math.floor(Math.random() * 50) + 10} live</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent NFT Drops */}
        <Card className="bg-white/10 border-purple-400/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-400" />
              Recent NFT Drops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <img src={`/placeholder.svg?height=50&width=50`} alt="NFT" className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <div className="text-white font-semibold">Viewer Badge #{i}</div>
                    <div className="text-gray-400 text-sm">Earned by watching 1hr+</div>
                  </div>
                  <Badge className="bg-purple-600 text-white">New</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
