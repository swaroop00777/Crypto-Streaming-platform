"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, Zap, Gift } from "lucide-react"

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

interface GameArenaProps {
  user: User
  onBack: () => void
  onReward: (nft: NFT) => void
}

type GamePhase = "setup" | "shooting" | "ai-turn" | "result" | "reward"

export default function GameArena({ user, onBack, onReward }: GameArenaProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>("setup")
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [shotPower, setShotPower] = useState(50)
  const [shotDirection, setShotDirection] = useState<"left" | "center" | "right">("center")
  const [isCharging, setIsCharging] = useState(false)
  const [gameResult, setGameResult] = useState<"win" | "lose" | "draw" | null>(null)
  const [earnedTokens, setEarnedTokens] = useState(0)
  const [earnedNFT, setEarnedNFT] = useState<NFT | null>(null)

  const maxRounds = 5

  const startGame = () => {
    setGamePhase("shooting")
    setPlayerScore(0)
    setAiScore(0)
    setCurrentRound(1)
    setGameResult(null)
    setEarnedTokens(0)
    setEarnedNFT(null)
  }

  const chargePower = () => {
    if (isCharging) return
    setIsCharging(true)

    const interval = setInterval(() => {
      setShotPower((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsCharging(false)
          return 100
        }
        return prev + 2
      })
    }, 50)

    setTimeout(() => {
      clearInterval(interval)
      setIsCharging(false)
    }, 3000)
  }

  const shoot = () => {
    if (isCharging) return

    // Calculate shot success based on power and direction
    const powerFactor = shotPower > 80 ? 0.9 : shotPower > 50 ? 0.7 : 0.5
    const directionFactor = shotDirection === "center" ? 0.6 : 0.8
    const success = Math.random() < powerFactor * directionFactor

    if (success) {
      setPlayerScore((prev) => prev + 1)
    }

    setShotPower(50)
    setGamePhase("ai-turn")

    // AI turn after delay
    setTimeout(() => {
      const aiSuccess = Math.random() < 0.6 // AI has 60% success rate
      if (aiSuccess) {
        setAiScore((prev) => prev + 1)
      }

      if (currentRound >= maxRounds) {
        // Game over
        const finalPlayerScore = success ? playerScore + 1 : playerScore
        const finalAiScore = aiSuccess ? aiScore + 1 : aiScore

        let result: "win" | "lose" | "draw"
        if (finalPlayerScore > finalAiScore) {
          result = "win"
        } else if (finalPlayerScore < finalAiScore) {
          result = "lose"
        } else {
          result = "draw"
        }

        setGameResult(result)
        calculateRewards(result)
        setGamePhase("result")
      } else {
        setCurrentRound((prev) => prev + 1)
        setGamePhase("shooting")
      }
    }, 2000)
  }

  const calculateRewards = (result: "win" | "lose" | "draw") => {
    let tokens = 0
    let nft: NFT | null = null

    if (result === "win") {
      tokens = Math.floor(Math.random() * 11) + 10 // 10-20 tokens

      // 20% chance to get NFT on win
      if (Math.random() < 0.2) {
        const nftTypes: NFT["type"][] = ["jersey", "ball", "boots", "gloves"]
        const rarities: NFT["rarity"][] = ["common", "common", "rare", "epic"]

        nft = {
          id: Date.now().toString(),
          name: `Victory ${nftTypes[Math.floor(Math.random() * nftTypes.length)]}`,
          type: nftTypes[Math.floor(Math.random() * nftTypes.length)],
          rarity: rarities[Math.floor(Math.random() * rarities.length)],
          image: "/placeholder.svg?height=100&width=100",
        }
      }
    } else if (result === "draw") {
      tokens = Math.floor(Math.random() * 6) + 5 // 5-10 tokens
    } else {
      tokens = Math.floor(Math.random() * 3) + 2 // 2-4 tokens
    }

    setEarnedTokens(tokens)
    setEarnedNFT(nft)
  }

  const claimRewards = () => {
    if (earnedNFT) {
      onReward(earnedNFT)
    }
    onBack()
  }

  if (gamePhase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={onBack} className="text-white border-white/30">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Quick Match Arena</h1>
          </div>

          <div className="text-center">
            <div className="mb-8">
              <div className="text-8xl mb-4">⚽</div>
              <h2 className="text-4xl font-bold text-white mb-4">Penalty Shootout</h2>
              <p className="text-green-200 text-lg">Score more goals than the AI in 5 rounds to win!</p>
            </div>

            <Card className="bg-white/10 border-green-400/30 max-w-md mx-auto mb-8">
              <CardHeader>
                <CardTitle className="text-white">Match Rules</CardTitle>
              </CardHeader>
              <CardContent className="text-green-200 space-y-2">
                <p>• 5 penalty shots each</p>
                <p>• Choose direction and power</p>
                <p>• Win: 10-20 PEN tokens + possible NFT</p>
                <p>• Draw: 5-10 PEN tokens</p>
                <p>• Loss: 2-4 PEN tokens</p>
              </CardContent>
            </Card>

            <Button
              onClick={startGame}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl"
            >
              <Zap className="w-6 h-6 mr-2" />
              Start Match
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (gamePhase === "result") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            {gameResult === "win" && (
              <>
                <div className="text-8xl mb-4">🏆</div>
                <h2 className="text-5xl font-bold text-yellow-400 mb-4">Victory!</h2>
                <p className="text-green-200 text-xl">Congratulations! You won the match!</p>
              </>
            )}
            {gameResult === "lose" && (
              <>
                <div className="text-8xl mb-4">😔</div>
                <h2 className="text-5xl font-bold text-red-400 mb-4">Defeat</h2>
                <p className="text-green-200 text-xl">Better luck next time!</p>
              </>
            )}
            {gameResult === "draw" && (
              <>
                <div className="text-8xl mb-4">🤝</div>
                <h2 className="text-5xl font-bold text-blue-400 mb-4">Draw</h2>
                <p className="text-green-200 text-xl">Great effort! It was a close match!</p>
              </>
            )}
          </div>

          <Card className="bg-white/10 border-green-400/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Final Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-4">
                {playerScore} - {aiScore}
              </div>
              <div className="text-green-200">You vs AI</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-yellow-400/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Gift className="w-6 h-6" />
                Rewards Earned
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="text-2xl">🪙</div>
                <span className="text-xl font-bold text-yellow-400">{earnedTokens} PEN</span>
              </div>

              {earnedNFT && (
                <div className="border-t border-white/20 pt-4">
                  <div className="text-lg font-semibold text-white mb-2">Bonus NFT Reward!</div>
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={earnedNFT.image || "/placeholder.svg"}
                      alt={earnedNFT.name}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div>
                      <div className="font-semibold text-white">{earnedNFT.name}</div>
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        {earnedNFT.rarity}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            onClick={claimRewards}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl"
          >
            Claim Rewards & Continue
          </Button>
        </div>
      </div>
    )
  }

  // Game playing phases
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={onBack} className="text-white border-white/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quit Match
          </Button>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              Round {currentRound}/{maxRounds}
            </div>
            <div className="text-green-200">Quick Match</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {playerScore} - {aiScore}
            </div>
            <div className="text-green-200">You vs AI</div>
          </div>
        </div>

        {/* Game Field */}
        <div className="relative bg-green-600 rounded-lg p-8 mb-6 min-h-96">
          <div className="absolute inset-0 bg-gradient-to-t from-green-700 to-green-500 rounded-lg opacity-50"></div>

          {/* Goal */}
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4">🥅</div>

            {gamePhase === "shooting" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Your Turn to Shoot!</h3>

                  {/* Direction Selection */}
                  <div className="flex justify-center gap-4 mb-6">
                    {(["left", "center", "right"] as const).map((dir) => (
                      <Button
                        key={dir}
                        variant={shotDirection === dir ? "default" : "outline"}
                        onClick={() => setShotDirection(dir)}
                        className={shotDirection === dir ? "bg-yellow-500 text-black" : "text-white border-white/30"}
                      >
                        {dir.charAt(0).toUpperCase() + dir.slice(1)}
                      </Button>
                    ))}
                  </div>

                  {/* Power Meter */}
                  <div className="max-w-md mx-auto mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">Power</span>
                      <span className="text-white font-bold">{shotPower}%</span>
                    </div>
                    <Progress value={shotPower} className="h-4" />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-x-4">
                    <Button onClick={chargePower} disabled={isCharging} className="bg-blue-600 hover:bg-blue-700">
                      {isCharging ? "Charging..." : "Charge Power"}
                    </Button>
                    <Button onClick={shoot} disabled={isCharging} className="bg-red-600 hover:bg-red-700">
                      <Target className="w-4 h-4 mr-2" />
                      Shoot!
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {gamePhase === "ai-turn" && (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">AI is shooting...</h3>
                <div className="text-6xl animate-bounce">⚽</div>
              </div>
            )}
          </div>
        </div>

        {/* Game Progress */}
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: maxRounds }, (_, i) => (
            <div
              key={i}
              className={`h-3 rounded-full ${
                i < currentRound - 1 ? "bg-green-400" : i === currentRound - 1 ? "bg-yellow-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
