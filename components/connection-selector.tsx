"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "lucide-react"

interface ConnectionSelectorProps {
  onSelect: (connectionString: string, name: string) => void
}

export function ConnectionSelector({ onSelect }: ConnectionSelectorProps) {
  const [connections, setConnections] = useState<{ name: string; envKey: string }[]>([])

  useEffect(() => {
    const fetchConnections = async () => {
      const response = await fetch("/api/mongodb/connections")
      const data = await response.json()
      setConnections(data)
    }
    fetchConnections()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {connections.map((connection) => (
        <Card key={connection.envKey} className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {connection.name}
            </CardTitle>
            <CardDescription>Connect to {connection.name.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => onSelect(connection.envKey, connection.name)}>
              Connect
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

