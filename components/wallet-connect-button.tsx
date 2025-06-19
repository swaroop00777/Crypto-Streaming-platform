"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { useWeb3 } from "@/hooks/useWeb3"

export default function WalletConnectButton() {
  const { isConnected, address, balance, isLoading, error, connectWallet, disconnect, isMetaMaskInstalled } = useWeb3()
  const [copied, setCopied] = useState(false)

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      alert("Please install MetaMask to connect your wallet")
      window.open("https://metamask.io/download/", "_blank")
      return
    }

    try {
      await connectWallet()
    } catch (err) {
      console.error("Failed to connect wallet:", err)
    }
  }

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openEtherscan = () => {
    if (address) {
      window.open(`https://sepolia.etherscan.io/address/${address}`, "_blank")
    }
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isMetaMaskInstalled && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                MetaMask is required to use this application. Please install it first.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button onClick={handleConnect} disabled={isLoading || !isMetaMaskInstalled} className="w-full">
            {isLoading ? "Connecting..." : "Connect MetaMask"}
          </Button>

          <div className="text-xs text-gray-500 text-center">Make sure you're on Sepolia testnet</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Address:</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </code>
              <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 p-0">
                {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={openEtherscan} className="h-6 w-6 p-0">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Balance:</span>
            <Badge variant="outline" className="font-mono">
              {balance.toFixed(4)} ETH
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Network:</span>
            <Badge className="bg-green-100 text-green-800">Sepolia Testnet</Badge>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Button onClick={disconnect} variant="outline" className="w-full">
          Disconnect
        </Button>
      </CardContent>
    </Card>
  )
}
