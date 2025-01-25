"use client"

import { useState, useEffect } from "react"
import { Database, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CollectionsView } from "@/components/collections-view"
import { ConnectionSelector } from "@/components/connection-selector"
import { connectToMongoDB, getDatabases } from "@/utils/mongodb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Home() {
  const [connectionKey, setConnectionKey] = useState<string>("")
  const [connectionName, setConnectionName] = useState<string>("")
  const [databases, setDatabases] = useState<string[]>([])
  const [selectedDatabase, setSelectedDatabase] = useState<string>("")
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async (key: string, name: string) => {
    setConnectionStatus("connecting")
    setError(null)
    try {
      await connectToMongoDB(key)
      const dbList = await getDatabases(key)
      setDatabases(dbList)
      setConnectionStatus("connected")
      setConnectionKey(key)
      setConnectionName(name)
    } catch (err: any) {
      setError(err.message)
      setConnectionStatus("disconnected")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <h1 className="hidden font-bold sm:inline-block">MongoDB Manager</h1>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            {connectionStatus === "connected" && (
              <div className="text-sm text-muted-foreground">Connected to {connectionName}</div>
            )}
            <ThemeToggle />
            <Button variant="outline" size="icon" asChild>
              <a href="https://github.com/yourusername/mongodb-manager" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-4">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</div>
        )}

        {connectionStatus !== "connected" ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Select a Database Connection</h2>
            <ConnectionSelector onSelect={handleConnect} />
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Select onValueChange={(value) => setSelectedDatabase(value)}>
                <SelectTrigger className="max-w-[300px]">
                  <SelectValue placeholder="Select a database" />
                </SelectTrigger>
                <SelectContent>
                  {databases.map((db) => (
                    <SelectItem key={db} value={db}>
                      {db}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setConnectionStatus("disconnected")
                  setSelectedDatabase("")
                  setDatabases([])
                  setConnectionKey("")
                  setConnectionName("")
                }}
              >
                Change Connection
              </Button>
            </div>

            {selectedDatabase && <CollectionsView connectionKey={connectionKey} database={selectedDatabase} />}
          </div>
        )}
      </main>
    </div>
  )
}

