"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Database, FolderOpen, Plus } from "lucide-react"
import { getCollections, getDocuments } from "@/utils/mongodb"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DocumentCard } from "./document-card"
import { Skeleton } from "@/components/ui/skeleton"

interface CollectionsViewProps {
  connectionKey: string
  database: string
}

export function CollectionsView({ connectionKey, database }: CollectionsViewProps) {
  const [collections, setCollections] = useState<string[]>([])
  const [documents, setDocuments] = useState<{ [key: string]: any[] }>({})
  const [loading, setLoading] = useState(true)
  const [activeCollection, setActiveCollection] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionList = await getCollections(connectionKey, database)
        setCollections(collectionList)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch collections:", error)
        setLoading(false)
      }
    }

    if (database) {
      fetchCollections()
    }
  }, [database, connectionKey])

  const handleCollectionSelect = async (collectionName: string) => {
    setActiveCollection(collectionName)
    try {
      const docs = await getDocuments(connectionKey, database, collectionName)
      setDocuments((prev) => ({ ...prev, [collectionName]: docs }))
    } catch (error) {
      console.error("Failed to fetch documents:", error)
    }
  }

  const handleEditDocument = async (doc: any) => {
    // Implement edit functionality
    console.log("Editing document:", doc)
  }

  const handleDeleteDocument = async (id: string) => {
    // Implement delete functionality
    console.log("Deleting document:", id)
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[230px]" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Collections
          </h2>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Accordion type="single" collapsible>
            {collections.map((collection) => (
              <AccordionItem key={collection} value={collection}>
                <AccordionTrigger className="px-4" onClick={() => handleCollectionSelect(collection)}>
                  <div className="flex items-center">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    {collection}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-9 py-2 text-sm text-muted-foreground">
                    {documents[collection]?.length || 0} documents
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {activeCollection ? `${activeCollection} Documents` : "Select a Collection"}
          </h2>
          {activeCollection && (
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          )}
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeCollection &&
              documents[activeCollection]?.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={doc}
                  onEdit={handleEditDocument}
                  onDelete={handleDeleteDocument}
                />
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

