import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params

    let user = await db.getUser(address)

    if (!user) {
      // Create new user if doesn't exist
      user = await db.createUser({
        address: address.toLowerCase(),
        username: `User${address.slice(-6)}`,
        balance: 0,
        totalEarned: 0,
        isStreamer: false,
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params
    const body = await request.json()

    const user = await db.updateUser(address, {
      username: body.username,
      avatar: body.avatar,
      isStreamer: body.isStreamer,
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
