// Simple JSON-based database for v0 compatibility
export interface User {
  address: string
  username?: string
  avatar?: string
  balance: number
  nfts: number
  followers: number
  following: number
  totalEarned: number
  isStreamer: boolean
  createdAt: string
  updatedAt: string
}

export interface Stream {
  id: string
  title: string
  creator: string
  creatorAddress: string
  viewers: number
  category: string
  thumbnail: string
  isLive: boolean
  tips: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface TipTransaction {
  id: string
  fromAddress: string
  toAddress: string
  amount: number
  txHash: string
  status: "pending" | "confirmed" | "failed"
  timestamp: string
  streamId?: string
}

export interface Follow {
  id: string
  followerAddress: string
  followingAddress: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  streamId: string
  userAddress: string
  message: string
  isTip: boolean
  tipAmount?: number
  createdAt: string
}

// In-memory storage (in production, this would be replaced with actual database)
class SimpleDatabase {
  private users: Map<string, User> = new Map()
  private streams: Map<string, Stream> = new Map()
  private tips: Map<string, TipTransaction> = new Map()
  private follows: Map<string, Follow> = new Map()
  private chatMessages: Map<string, ChatMessage[]> = new Map()

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // Initialize with some sample data
    const sampleStreams: Stream[] = [
      {
        id: "stream-1",
        title: "Epic Gaming Session - Live Now!",
        creator: "ProGamer",
        creatorAddress: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
        viewers: 1234,
        category: "Gaming",
        thumbnail: "/placeholder.jpg",
        isLive: true,
        tips: 45,
        description: "Join me for an epic gaming session with crypto rewards!",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "stream-2",
        title: "Crypto Trading Analysis",
        creator: "CryptoExpert",
        creatorAddress: "0x853e46Dd7645D5532936a4b9E5C5E5E5E5E5E5E5",
        viewers: 856,
        category: "Finance",
        thumbnail: "/placeholder.jpg",
        isLive: true,
        tips: 23,
        description: "Live crypto market analysis and trading tips",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    sampleStreams.forEach((stream) => this.streams.set(stream.id, stream))
  }

  // User operations
  async getUser(address: string): Promise<User | null> {
    return this.users.get(address.toLowerCase()) || null
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user: User = {
      address: userData.address!.toLowerCase(),
      username: userData.username || `User${userData.address!.slice(-6)}`,
      avatar: userData.avatar,
      balance: 0,
      nfts: 0,
      followers: 0,
      following: 0,
      totalEarned: 0,
      isStreamer: userData.isStreamer || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.users.set(user.address, user)
    return user
  }

  async updateUser(address: string, userData: Partial<User>): Promise<User | null> {
    const user = this.users.get(address.toLowerCase())
    if (!user) return null

    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: new Date().toISOString(),
    }
    this.users.set(address.toLowerCase(), updatedUser)
    return updatedUser
  }

  // Stream operations
  async getStreams(): Promise<Stream[]> {
    return Array.from(this.streams.values()).filter((stream) => stream.isLive)
  }

  async getStream(id: string): Promise<Stream | null> {
    return this.streams.get(id) || null
  }

  async createStream(streamData: Partial<Stream>): Promise<Stream> {
    const stream: Stream = {
      id: `stream-${Date.now()}`,
      title: streamData.title!,
      creator: streamData.creator!,
      creatorAddress: streamData.creatorAddress!.toLowerCase(),
      viewers: 0,
      category: streamData.category!,
      thumbnail: streamData.thumbnail || "/placeholder.jpg",
      isLive: true,
      tips: 0,
      description: streamData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.streams.set(stream.id, stream)
    return stream
  }

  async updateStream(id: string, streamData: Partial<Stream>): Promise<Stream | null> {
    const stream = this.streams.get(id)
    if (!stream) return null

    const updatedStream = {
      ...stream,
      ...streamData,
      updatedAt: new Date().toISOString(),
    }
    this.streams.set(id, updatedStream)
    return updatedStream
  }

  async deleteStream(id: string): Promise<boolean> {
    return this.streams.delete(id)
  }

  // Tip operations
  async createTip(tipData: {
    fromAddress: string
    toAddress: string
    amount: number
    txHash: string
    streamId?: string
  }): Promise<TipTransaction> {
    const tip: TipTransaction = {
      id: `tip-${Date.now()}`,
      fromAddress: tipData.fromAddress.toLowerCase(),
      toAddress: tipData.toAddress.toLowerCase(),
      amount: tipData.amount,
      txHash: tipData.txHash,
      status: "pending",
      timestamp: new Date().toISOString(),
      streamId: tipData.streamId,
    }
    this.tips.set(tip.id, tip)
    return tip
  }

  async updateTipStatus(tipId: string, status: "confirmed" | "failed"): Promise<TipTransaction | null> {
    const tip = this.tips.get(tipId)
    if (!tip) return null

    tip.status = status
    this.tips.set(tipId, tip)

    // Update user's total earned if confirmed
    if (status === "confirmed") {
      const user = this.users.get(tip.toAddress)
      if (user) {
        user.totalEarned += tip.amount
        this.users.set(tip.toAddress, user)
      }
    }

    return tip
  }

  async getTipHistory(address: string): Promise<TipTransaction[]> {
    return Array.from(this.tips.values()).filter(
      (tip) => tip.fromAddress === address.toLowerCase() || tip.toAddress === address.toLowerCase(),
    )
  }

  // Chat operations
  async addChatMessage(message: Omit<ChatMessage, "id" | "createdAt">): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      ...message,
      createdAt: new Date().toISOString(),
    }

    const streamMessages = this.chatMessages.get(message.streamId) || []
    streamMessages.push(chatMessage)
    this.chatMessages.set(message.streamId, streamMessages)

    return chatMessage
  }

  async getChatMessages(streamId: string): Promise<ChatMessage[]> {
    return this.chatMessages.get(streamId) || []
  }
}

export const db = new SimpleDatabase()
