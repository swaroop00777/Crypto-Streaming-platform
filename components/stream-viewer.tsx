"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Coins,
  Gift,
  Volume2,
  Maximize,
  Settings,
  Send,
} from "lucide-react"

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

interface User {
  address: string
  balance: number
  nfts: number
  followers: number
  following: number
  totalEarned: number
}

interface StreamViewerProps {
  stream: Stream
  user: User
  onBack: () => void
}

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: Date
  isTip?: boolean
  tipAmount?: number
}

export default function StreamViewer({ stream, user, onBack }: StreamViewerProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [tipAmount, setTipAmount] = useState("")
  const [showTipModal, setShowTipModal] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      username: "CryptoFan123",
      message: "Great stream! Learning so much about DeFi",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      username: "NFTCollector",
      message: "When will you mint the next NFT collection?",
      timestamp: new Date(Date.now() - 45000),
    },
    {
      id: "3",
      username: "TradingPro",
      message: "Thanks for the alpha! 🚀",
      timestamp: new Date(Date.now() - 30000),
      isTip: true,
      tipAmount: 25,
    },
  ])

  const [viewerCount, setViewerCount] = useState(stream.viewers)
  const [totalTips, setTotalTips] = useState(stream.tips)

  // Simulate live viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 10) - 5)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const sendMessage = () => {
    if (!chatMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: "You",
      message: chatMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, newMessage])
    setChatMessage("")
  }

  const sendTip = () => {
    const amount = Number.parseFloat(tipAmount)
    if (!amount || amount <= 0 || amount > user.balance) return

    const tipMessage: ChatMessage = {
      id: Date.now().toString(),
      username: "You",
      message: `Sent a tip! Keep up the great work! 💰`,
      timestamp: new Date(),
      isTip: true,
      tipAmount: amount,
    }

    setChatMessages((prev) => [...prev, tipMessage])
    setTotalTips((prev) => prev + amount)
    setTipAmount("")
    setShowTipModal(false)

    // Show NFT reward notification (20% chance)
    if (Math.random() < 0.2) {
      setTimeout(() => {
        alert("🎉 You earned a Generous Tipper NFT!")
      }, 1000)
    }
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
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">${user.balance.toFixed(2)} USDC</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            <Card className="bg-black border-white/20 mb-6">
              <div className="relative aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-t-lg">
                {/* Video Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📺</div>
                    <div className="text-white text-xl font-semibold mb-2">Live Stream</div>
                    <Badge className="bg-red-600 text-white">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                      LIVE
                    </Badge>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-black/60 text-white">
                      <Users className="w-3 h-3 mr-1" />
                      {viewerCount.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stream Info */}
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-2">{stream.title}</h1>
                    <div className="flex items-center gap-4 text-gray-300">
                      <span className="font-semibold">{stream.creator}</span>
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        {stream.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setIsFollowing(!isFollowing)}
                      variant={isFollowing ? "default" : "outline"}
                      className={
                        isFollowing
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "text-white border-white/30 hover:bg-white/10 hover:border-white/50 hover:text-white"
                      }
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? "fill-current text-white" : ""}`} />
                      {isFollowing ? "Following" : "Follow"}
                    </Button>

                    <Button onClick={() => setShowTipModal(true)} className="bg-yellow-600 hover:bg-yellow-700">
                      <Coins className="w-4 h-4 mr-2" />
                      Tip USDC
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{viewerCount.toLocaleString()} viewers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span>${totalTips} in tips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 border-white/20 h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-4">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      {msg.isTip ? (
                        <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Coins className="w-4 h-4 text-yellow-400" />
                            <span className="font-semibold text-yellow-400">{msg.username}</span>
                            <span className="text-yellow-300">tipped ${msg.tipAmount}</span>
                          </div>
                          <div className="text-white">{msg.message}</div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-semibold text-purple-400">{msg.username}:</span>
                          <span className="text-white ml-2">{msg.message}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <Button onClick={sendMessage} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* NFT Rewards */}
            <Card className="bg-white/10 border-green-400/30 mt-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <Gift className="w-5 h-5 text-green-400" />
                  Viewer Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-300">Watch for rewards:</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">5 min watch</span>
                    <Badge className="bg-green-600 text-white text-xs">✓ Earned</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">15 min watch</span>
                    <Badge variant="outline" className="text-gray-400 border-gray-400 text-xs">
                      Locked
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">Send tip</span>
                    <Badge variant="outline" className="text-gray-400 border-gray-400 text-xs">
                      Locked
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white/10 border-yellow-400/30 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Coins className="w-6 h-6 text-yellow-400" />
                Send USDC Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-lg text-white mb-2">Tip {stream.creator}</div>
                <div className="text-gray-300 text-sm">Show your support with USDC</div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 25, 50].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setTipAmount(amount.toString())}
                      className="text-white border-white/30"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <Input
                  placeholder="Custom amount"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="text-sm text-gray-300">Balance: ${user.balance.toFixed(2)} USDC</div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowTipModal(false)}
                  variant="outline"
                  className="flex-1 text-white border-white/30 hover:bg-white/10 hover:border-white/50 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={sendTip}
                  disabled={
                    !tipAmount || Number.parseFloat(tipAmount) <= 0 || Number.parseFloat(tipAmount) > user.balance
                  }
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Tip
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
