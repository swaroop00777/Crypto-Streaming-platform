"use client"

import { useState, useEffect, useCallback } from "react"
import { web3Service, DEFAULT_RECIPIENT, isMetaMaskInstalled } from "@/lib/web3"

interface UseWeb3Return {
  isConnected: boolean
  address: string | null
  balance: number
  isLoading: boolean
  error: string | null
  connectWallet: () => Promise<void>
  sendTip: (toAddress: string, amount: number, streamId?: string) => Promise<string>
  disconnect: () => void
  isMetaMaskInstalled: boolean
}

export function useWeb3(): UseWeb3Return {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = useCallback(async () => {
    console.log("useWeb3: connectWallet called")
    setIsLoading(true)
    setError(null)

    try {
      const { address: walletAddress, balance: walletBalance } = await web3Service.connectWallet()

      console.log("useWeb3: Got wallet data", { walletAddress, walletBalance })

      setAddress(walletAddress)
      setBalance(walletBalance)
      setIsConnected(!!walletAddress)

      if (walletAddress) {
        // Set up event listeners
        web3Service.onAccountChange(async (accounts) => {
          console.log("Account changed:", accounts)
          if (accounts.length === 0) {
            disconnect()
          } else {
            setAddress(accounts[0])
            const newBalance = await web3Service.getETHBalance(accounts[0])
            setBalance(newBalance)
          }
        })

        web3Service.onChainChange(() => {
          console.log("Chain changed, reloading...")
          window.location.reload()
        })
      }
    } catch (err: any) {
      console.error("useWeb3: Wallet connection error:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const sendTip = useCallback(
    async (toAddress: string = DEFAULT_RECIPIENT, amount: number, streamId?: string): Promise<string> => {
      console.log("useWeb3: sendTip called", { toAddress, amount, streamId })

      if (!address) {
        throw new Error("Wallet not connected")
      }

      setIsLoading(true)
      setError(null)

      try {
        // Send blockchain transaction
        const txHash = await web3Service.sendTip(toAddress, amount)
        console.log("useWeb3: Tip sent successfully", txHash)

        // Update local balance
        const newBalance = await web3Service.getETHBalance(address)
        setBalance(newBalance)

        return txHash
      } catch (err: any) {
        console.error("useWeb3: Error sending tip:", err)
        setError(err.message || "Failed to send tip")
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [address],
  )

  const disconnect = useCallback(() => {
    console.log("useWeb3: Disconnecting wallet")
    web3Service.disconnect()
    setIsConnected(false)
    setAddress(null)
    setBalance(0)
    setError(null)
  }, [])

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          console.log("useWeb3: Existing accounts:", accounts)
          if (accounts.length > 0) {
            await connectWallet()
          }
        } catch (err) {
          console.error("useWeb3: Error checking wallet connection:", err)
        }
      }
    }

    checkConnection()
  }, [connectWallet])

  return {
    isConnected,
    address,
    balance,
    isLoading,
    error,
    connectWallet,
    sendTip,
    disconnect,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  }
}
