import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { web3Service } from "@/lib/web3"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromAddress, toAddress, amount, txHash, streamId } = body

    // Create tip record
    const tip = await db.createTip({
      fromAddress: fromAddress.toLowerCase(),
      toAddress: toAddress.toLowerCase(),
      amount: Number.parseFloat(amount),
      txHash,
      streamId,
    })

    // Start monitoring transaction
    monitorTransaction(tip.id, txHash)

    return NextResponse.json(tip)
  } catch (error) {
    console.error("Error creating tip:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function monitorTransaction(tipId: string, txHash: string) {
  const maxAttempts = 30 // Monitor for ~5 minutes
  let attempts = 0

  const checkStatus = async () => {
    try {
      const status = await web3Service.getTransactionStatus(txHash)

      if (status === "confirmed") {
        await db.updateTipStatus(tipId, "confirmed")
        return
      }

      if (status === "failed") {
        await db.updateTipStatus(tipId, "failed")
        return
      }

      // Still pending, check again
      attempts++
      if (attempts < maxAttempts) {
        setTimeout(checkStatus, 10000) // Check every 10 seconds
      } else {
        // Mark as failed after max attempts
        await db.updateTipStatus(tipId, "failed")
      }
    } catch (error) {
      console.error("Error monitoring transaction:", error)
    }
  }

  // Start monitoring
  setTimeout(checkStatus, 5000) // Initial delay of 5 seconds
}
