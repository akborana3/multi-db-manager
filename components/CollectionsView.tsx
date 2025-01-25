"use client"

import { useState, useEffect } from "react"
import { getCollections, getDocuments } from "@/utils/mongodb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown } from "lucide-react"

export default function CollectionsView({ database }: { database: string }) {
  const [collections, setCollections] = useState<string[]>([])
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())
  const [documents, setDocuments] = useState<{ [key: string]: any[] }>({})

  useEffect(() => {
    const fetchCollections = async () => {
      const collectionList = await getCollections(database)
      setCollections(collectionList)
    }
    if (database) {
      fetchCollections()
    }
  }, [database])

  const toggleCollection = async (collectionName: string) => {
    const newExpandedCollections = new Set(expandedCollections)
    if (expandedCollections.has(collectionName)) {
      newExpandedCollections.delete(collectionName)
    } else {
      newExpandedCollections.add(collectionName)
      if (!documents[collectionName]) {
        const docs = await getDocuments(database, collectionName)
        setDocuments((prev) => ({ ...prev, [collectionName]: docs }))
      }
    }
    setExpandedCollections(newExpandedCollections)
  }

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-semibold mb-4">Collections</h2>
      {collections.map((collection) => (
        <Collapsible key={collection}>
          <CollapsibleTrigger
            className="flex items-center w-full text-left py-2 hover:bg-gray-100"
            onClick={() => toggleCollection(collection)}
          >
            {expandedCollections.has(collection) ? <ChevronDown className="mr-2" /> : <ChevronRight className="mr-2" />}
            {collection}
          </CollapsibleTrigger>
          <CollapsibleContent>
            {documents[collection]?.map((doc, index) => (
              <div key={index} className="pl-6 py-1 hover:bg-gray-100">
                {JSON.stringify(doc).substring(0, 50)}...
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}

