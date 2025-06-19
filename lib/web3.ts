import { ethers } from "ethers"

export const isMetaMaskInstalled = () => typeof window !== "undefined" && typeof window.ethereum !== "undefined"

// Default recipient address
export const DEFAULT_RECIPIENT = "0x555A255B29741109bA2109fe0fA4d409cCa73954"

// Ethereum Sepolia Testnet configuration
export const ETHEREUM_SEPOLIA = {
  chainId: "0xaa36a7", // 11155111 in hex
  chainName: "Sepolia test network",
  nativeCurrency: {
    name: "SepoliaETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.sepolia.org", "https://sepolia.infura.io/v3/"],
  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null

  async connectWallet(): Promise<{ address: string | null; balance: number }> {
    console.log("Connecting wallet...")

    if (!isMetaMaskInstalled()) {
      console.log("MetaMask not installed")
      return { address: null, balance: 0 }
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      console.log("Accounts:", accounts)

      // Switch to Sepolia
      await this.switchToSepolia()

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()

      const address = await this.signer.getAddress()
      console.log("Connected address:", address)

      // Get balance
      const balance = await this.getETHBalance(address)
      console.log("ETH balance:", balance)

      return { address, balance }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  async switchToSepolia(): Promise<void> {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ETHEREUM_SEPOLIA.chainId }],
      })
      console.log("Switched to Sepolia")
    } catch (switchError: any) {
      console.log("Switch error:", switchError)

      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [ETHEREUM_SEPOLIA],
          })
          console.log("Added Sepolia network")
        } catch (addError) {
          console.error("Failed to add network:", addError)
          throw new Error("Failed to add Ethereum Sepolia network")
        }
      } else {
        throw switchError
      }
    }
  }

  async getETHBalance(address: string): Promise<number> {
    if (!this.provider) {
      console.log("No provider available")
      return 0
    }

    try {
      const balance = await this.provider.getBalance(address)
      const balanceInEth = Number.parseFloat(ethers.formatEther(balance))
      console.log("Raw balance:", balance.toString())
      console.log("Balance in ETH:", balanceInEth)
      return balanceInEth
    } catch (error) {
      console.error("Error getting ETH balance:", error)
      return 0
    }
  }

  async sendTip(recipientAddress: string = DEFAULT_RECIPIENT, amount: number): Promise<string> {
    console.log("Sending tip:", { recipientAddress, amount })

    if (!this.signer) {
      throw new Error("Wallet not connected. Please connect your MetaMask wallet.")
    }

    if (!this.provider) {
      throw new Error("Provider not available")
    }

    try {
      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount.toString())
      console.log("Amount in wei:", amountInWei.toString())

      // Get current address and balance
      const fromAddress = await this.signer.getAddress()
      const balance = await this.provider.getBalance(fromAddress)

      console.log("From address:", fromAddress)
      console.log("Current balance:", ethers.formatEther(balance))
      console.log("Trying to send:", ethers.formatEther(amountInWei))

      if (balance < amountInWei) {
        throw new Error(
          `Insufficient ETH balance. You have ${ethers.formatEther(balance)} ETH but trying to send ${amount} ETH`,
        )
      }

      // Estimate gas
      const gasEstimate = await this.provider.estimateGas({
        to: recipientAddress,
        value: amountInWei,
      })

      console.log("Gas estimate:", gasEstimate.toString())

      // Send transaction
      const tx = await this.signer.sendTransaction({
        to: recipientAddress,
        value: amountInWei,
        gasLimit: gasEstimate,
      })

      console.log("Transaction sent:", tx.hash)

      // Wait for confirmation
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      return receipt!.hash
    } catch (error: any) {
      console.error("Error sending tip:", error)

      // Provide more specific error messages
      if (error.code === 4001) {
        throw new Error("Transaction rejected by user")
      } else if (error.code === -32603) {
        throw new Error("Internal JSON-RPC error. Please try again.")
      } else if (error.message.includes("insufficient funds")) {
        throw new Error("Insufficient ETH balance for transaction and gas fees")
      } else {
        throw new Error(error.message || "Failed to send transaction")
      }
    }
  }

  async getTransactionStatus(txHash: string): Promise<"pending" | "confirmed" | "failed"> {
    if (!this.provider) return "failed"

    try {
      const receipt = await this.provider.getTransactionReceipt(txHash)
      if (!receipt) return "pending"
      return receipt.status === 1 ? "confirmed" : "failed"
    } catch (error) {
      console.error("Error getting transaction status:", error)
      return "failed"
    }
  }

  onAccountChange(callback: (accounts: string[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", callback)
    }
  }

  onChainChange(callback: (chainId: string) => void): void {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", callback)
    }
  }

  disconnect(): void {
    this.provider = null
    this.signer = null
  }
}

export const web3Service = new Web3Service()

// Types for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
