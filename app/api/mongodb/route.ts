import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const clients: { [key: string]: MongoClient } = {}

async function getClient(connectionKey: string) {
  if (!clients[connectionKey]) {
    const connectionString = process.env[connectionKey]
    if (!connectionString) {
      throw new Error("Connection string not found")
    }
    clients[connectionKey] = new MongoClient(connectionString)
    await clients[connectionKey].connect()
  }
  return clients[connectionKey]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const connectionKey = searchParams.get("connectionKey")
  const database = searchParams.get("database")
  const collection = searchParams.get("collection")

  if (!connectionKey) {
    return NextResponse.json({ error: "Connection key not specified" }, { status: 400 })
  }

  try {
    const client = await getClient(connectionKey)

    switch (action) {
      case "getDatabases":
        const adminDb = client.db().admin()
        const dbInfo = await adminDb.listDatabases()
        return NextResponse.json(dbInfo.databases.map((db: any) => db.name))

      case "getCollections":
        if (!database) {
          return NextResponse.json({ error: "Database not specified" }, { status: 400 })
        }
        const db = client.db(database)
        const collections = await db.listCollections().toArray()
        return NextResponse.json(collections.map((col) => col.name))

      case "getDocuments":
        if (!database || !collection) {
          return NextResponse.json({ error: "Database or collection not specified" }, { status: 400 })
        }
        const docs = await client.db(database).collection(collection).find({}).toArray()
        return NextResponse.json(docs)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("MongoDB operation error:", error)
    return NextResponse.json({ error: "Failed to perform MongoDB operation" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { action, connectionKey, database, collection, document, update, id } = await request.json()

  if (!connectionKey) {
    return NextResponse.json({ error: "Connection key not specified" }, { status: 400 })
  }

  try {
    const client = await getClient(connectionKey)

    switch (action) {
      case "insertDocument":
        if (!database || !collection || !document)
          return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
        const result = await client.db(database).collection(collection).insertOne(document)
        return NextResponse.json(result)

      case "updateDocument":
        if (!database || !collection || !update || !id)
          return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
        const updateResult = await client.db(database).collection(collection).updateOne({ _id: id }, { $set: update })
        return NextResponse.json(updateResult)

      case "deleteDocument":
        if (!database || !collection || !id) return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
        const deleteResult = await client.db(database).collection(collection).deleteOne({ _id: id })
        return NextResponse.json(deleteResult)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("MongoDB operation error:", error)
    return NextResponse.json({ error: "Failed to perform MongoDB operation" }, { status: 500 })
  }
}

