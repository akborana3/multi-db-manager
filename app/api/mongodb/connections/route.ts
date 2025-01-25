import { NextResponse } from "next/server"

export async function GET() {
  const connections = Object.keys(process.env)
    .filter((key) => key.startsWith("MONGODB_URI"))
    .map((key) => ({
      name: key === "MONGODB_URI" ? "Primary Database" : `Database ${key.split("_").pop()}`,
      envKey: key,
    }))

  return NextResponse.json(connections)
}

