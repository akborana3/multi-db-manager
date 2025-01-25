import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const clients: { [key: string]: MongoClient } = {}

export async function POST(request: Request) {
  try {
    const { connectionKey } = await request.json()
    const connectionString = process.env[connectionKey]

    if (!connectionString) {
      return NextResponse.json({ success: false, error: "Connection string not found" }, { status: 400 })
    }

    // Close existing connection if any
    if (clients[connectionKey]) {
      await clients[connectionKey].close()
      delete clients[connectionKey]
    }

    // Create new connection
    const client = new MongoClient(connectionString)
    await client.connect()

    // Test the connection
    await client.db().admin().listDatabases()

    // Store the client
    clients[connectionKey] = client

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("MongoDB connection error:", error)
    return NextResponse.json({ success: false, error: "Failed to connect to MongoDB" }, { status: 500 })
  }
}

