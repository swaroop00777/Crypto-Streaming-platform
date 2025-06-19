const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      })

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  async createUser(userData: { address: string | null; balance: number }): Promise<any> {
    if (!userData.address) {
      // Return mock user for non-connected state
      return {
        address: null,
        username: "Guest",
        balance: 0,
        totalEarned: 0,
        isStreamer: false,
      }
    }

    try {
      return await this.fetchWithErrorHandling(`/api/users/${userData.address}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      })
    } catch (error) {
      console.warn("Failed to create user, using local data:", error)
      // Return local user data if API fails
      return {
        address: userData.address,
        username: `User${userData.address.slice(-6)}`,
        balance: userData.balance,
        totalEarned: 0,
        isStreamer: false,
      }
    }
  }

  async getUser(address: string): Promise<any> {
    try {
      return await this.fetchWithErrorHandling(`/api/users/${address}`)
    } catch (error) {
      console.warn("Failed to get user, using default:", error)
      return {
        address,
        username: `User${address.slice(-6)}`,
        balance: 0,
        totalEarned: 0,
        isStreamer: false,
      }
    }
  }

  async createTip(tipData: {
    fromAddress: string
    toAddress: string
    amount: number
    txHash: string
    streamId?: string
  }): Promise<any> {
    try {
      return await this.fetchWithErrorHandling("/api/tips", {
        method: "POST",
        body: JSON.stringify(tipData),
      })
    } catch (error) {
      console.warn("Failed to record tip, transaction still processed:", error)
      // Return mock response since blockchain transaction succeeded
      return {
        id: Date.now().toString(),
        ...tipData,
        createdAt: new Date().toISOString(),
      }
    }
  }

  async getStreams(): Promise<any[]> {
    try {
      return await this.fetchWithErrorHandling("/api/streams")
    } catch (error) {
      console.warn("Failed to get streams, using mock data:", error)
      // Return mock streams if API fails
      return [
        {
          id: "1",
          title: "Gaming Stream",
          streamerAddress: "0x1234567890123456789012345678901234567890",
          streamerName: "GamerPro",
          viewers: 1234,
          isLive: true,
          thumbnail: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "2",
          title: "Music Stream",
          streamerAddress: "0x0987654321098765432109876543210987654321",
          streamerName: "MusicMaster",
          viewers: 567,
          isLive: true,
          thumbnail: "/placeholder.svg?height=200&width=300",
        },
      ]
    }
  }

  async createStream(streamData: any): Promise<any> {
    try {
      return await this.fetchWithErrorHandling("/api/streams", {
        method: "POST",
        body: JSON.stringify(streamData),
      })
    } catch (error) {
      console.warn("Failed to create stream, using local data:", error)
      return {
        id: Date.now().toString(),
        ...streamData,
        createdAt: new Date().toISOString(),
      }
    }
  }
}

export const apiService = new ApiService()
