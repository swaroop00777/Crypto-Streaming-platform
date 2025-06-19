import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const streams = await db.getStreams()
    return NextResponse.json(streams)
  } catch (error) {
    console.error("Error fetching streams:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, creatorAddress, category, thumbnail, description } = body

    // Get or create user
    let user = await db.getUser(creatorAddress)
    if (!user) {
      user = await db.createUser({
        address: creatorAddress,
        isStreamer: true,
      })
    }

    const stream = await db.createStream({
      title,
      creator: user.username || `User${creatorAddress.slice(-6)}`,
      creatorAddress: creatorAddress.toLowerCase(),
      category,
      thumbnail,
      description,
    })

    return NextResponse.json(stream)
  } catch (error) {
    console.error("Error creating stream:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
