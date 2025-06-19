"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Filter } from "lucide-react"

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

interface NFTInventoryProps {
  user: User
  onBack: () => void
}

export default function NFTInventory({ user, onBack }: NFTInventoryProps) {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [filterType, setFilterType] = useState<string>("all")

  // Mock additional NFTs for demonstration
  const allNFTs: NFT[] = [
    ...user.nfts,
    {
      id: "3",
      name: "Lightning Ball",
      type: "ball",
      rarity: "epic",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "4",
      name: "Rookie Gloves",
      type: "gloves",
      rarity: "common",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "5",
      name: "Champion Jersey",
      type: "jersey",
      rarity: "legendary",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "6",
      name: "Speed Boots",
      type: "boots",
      rarity: "rare",
      image: "/placeholder.svg?height=150&width=150",
    },
  ]

  const filteredNFTs = filterType === "all" ? allNFTs : allNFTs.filter((nft) => nft.type === filterType)

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

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "shadow-lg shadow-yellow-400/20 border-yellow-400/50"
      case "epic":
        return "shadow-lg shadow-purple-400/20 border-purple-400/50"
      case "rare":
        return "shadow-lg shadow-blue-400/20 border-blue-400/50"
      default:
        return "border-gray-400/30"
    }
  }

  const nftStats = {
    total: allNFTs.length,
    legendary: allNFTs.filter((nft) => nft.rarity === "legendary").length,
    epic: allNFTs.filter((nft) => nft.rarity === "epic").length,
    rare: allNFTs.filter((nft) => nft.rarity === "rare").length,
    common: allNFTs.filter((nft) => nft.rarity === "common").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="text-white border-white/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">NFT Collection</h1>
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>

        {/* Collection Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white/10 border-green-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{nftStats.total}</div>
              <div className="text-green-200 text-sm">Total NFTs</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-400/10 border-yellow-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{nftStats.legendary}</div>
              <div className="text-yellow-200 text-sm">Legendary</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-400/10 border-purple-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{nftStats.epic}</div>
              <div className="text-purple-200 text-sm">Epic</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-400/10 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{nftStats.rare}</div>
              <div className="text-blue-200 text-sm">Rare</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-400/10 border-gray-400/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-400">{nftStats.common}</div>
              <div className="text-gray-200 text-sm">Common</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* NFT Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 border-green-400/30">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Your Collection</CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-green-200" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="jersey">Jerseys</option>
                      <option value="ball">Balls</option>
                      <option value="boots">Boots</option>
                      <option value="gloves">Gloves</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredNFTs.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredNFTs.map((nft) => (
                      <div
                        key={nft.id}
                        onClick={() => setSelectedNFT(nft)}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                          selectedNFT?.id === nft.id
                            ? getRarityGlow(nft.rarity) + " bg-white/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <div className="text-center">
                          <div className="text-white font-semibold text-sm mb-1">{nft.name}</div>
                          <Badge className={`text-xs ${getRarityColor(nft.rarity)}`}>{nft.rarity}</Badge>
                          <div className="text-green-200 text-xs mt-1 capitalize">{nft.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎁</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
                    <p className="text-green-200">
                      {filterType === "all"
                        ? "Win matches to start collecting NFTs!"
                        : `No ${filterType}s in your collection yet.`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* NFT Details */}
          <div>
            <Card className="bg-white/10 border-green-400/30 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">NFT Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedNFT ? (
                  <div className="space-y-4">
                    <img
                      src={selectedNFT.image || "/placeholder.svg"}
                      alt={selectedNFT.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />

                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{selectedNFT.name}</h3>
                      <Badge className={`mb-3 ${getRarityColor(selectedNFT.rarity)}`}>{selectedNFT.rarity}</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-200">Type:</span>
                        <span className="text-white capitalize">{selectedNFT.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-200">Token ID:</span>
                        <span className="text-white font-mono">#{selectedNFT.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-200">Blockchain:</span>
                        <span className="text-white">Polygon</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-200">Standard:</span>
                        <span className="text-white">ERC-721</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/20">
                      <h4 className="text-white font-semibold mb-2">Attributes</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-200">Power Boost:</span>
                          <span className="text-white">
                            +
                            {selectedNFT.rarity === "legendary"
                              ? "15"
                              : selectedNFT.rarity === "epic"
                                ? "10"
                                : selectedNFT.rarity === "rare"
                                  ? "5"
                                  : "2"}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-200">Accuracy Boost:</span>
                          <span className="text-white">
                            +
                            {selectedNFT.rarity === "legendary"
                              ? "12"
                              : selectedNFT.rarity === "epic"
                                ? "8"
                                : selectedNFT.rarity === "rare"
                                  ? "4"
                                  : "1"}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                        Equip NFT
                      </Button>
                      <Button variant="outline" className="w-full text-white border-white/30" disabled>
                        List on Marketplace
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">👆</div>
                    <p className="text-green-200">Select an NFT to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 border-green-400/30 mt-4">
              <CardHeader>
                <CardTitle className="text-white text-lg">Collection Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full text-white border-white/30" disabled>
                  View on OpenSea
                </Button>
                <Button variant="outline" className="w-full text-white border-white/30" disabled>
                  Transfer NFT
                </Button>
                <Button variant="outline" className="w-full text-white border-white/30" disabled>
                  Share Collection
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Collection Milestones */}
        <Card className="bg-white/10 border-green-400/30 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Collection Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-lg border ${nftStats.total >= 5 ? "bg-green-600/20 border-green-400" : "bg-gray-600/20 border-gray-400"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{nftStats.total >= 5 ? "✅" : "⏳"}</div>
                  <div>
                    <div className="text-white font-semibold">Collector</div>
                    <div className="text-sm text-green-200">Own 5 NFTs ({nftStats.total}/5)</div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border ${nftStats.legendary >= 1 ? "bg-yellow-600/20 border-yellow-400" : "bg-gray-600/20 border-gray-400"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{nftStats.legendary >= 1 ? "✅" : "⏳"}</div>
                  <div>
                    <div className="text-white font-semibold">Legend Hunter</div>
                    <div className="text-sm text-green-200">Own 1 Legendary ({nftStats.legendary}/1)</div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border ${nftStats.total >= 10 ? "bg-purple-600/20 border-purple-400" : "bg-gray-600/20 border-gray-400"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{nftStats.total >= 10 ? "✅" : "⏳"}</div>
                  <div>
                    <div className="text-white font-semibold">Master Collector</div>
                    <div className="text-sm text-green-200">Own 10 NFTs ({nftStats.total}/10)</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
