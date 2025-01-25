"use client"

import { useState } from "react"
import { insertDocument, updateDocument, deleteDocument, exportCollection, importCollection } from "@/utils/mongodb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Editor } from "@monaco-editor/react"

export default function DocumentViewer({ database }: { database: string }) {
  const [selectedCollection, setSelectedCollection] = useState("")
  const [documentContent, setDocumentContent] = useState("")
  const [operation, setOperation] = useState<"create" | "update" | "delete" | null>(null)

  const handleOperation = async () => {
    if (!selectedCollection) return

    try {
      let result
      switch (operation) {
        case "create":
          result = await insertDocument(database, selectedCollection, JSON.parse(documentContent))
          break
        case "update":
          const { _id, ...updateData } = JSON.parse(documentContent)
          result = await updateDocument(database, selectedCollection, _id, updateData)
          break
        case "delete":
          const { _id: deleteId } = JSON.parse(documentContent)
          result = await deleteDocument(database, selectedCollection, deleteId)
          break
      }
      console.log("Operation result:", result)
      setDocumentContent("")
      setOperation(null)
    } catch (error) {
      console.error("Operation failed:", error)
    }
  }

  const handleExport = async () => {
    if (!selectedCollection) return

    try {
      const data = await exportCollection(database, selectedCollection)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${selectedCollection}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCollection || !event.target.files) return

    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (e.target?.result) {
        try {
          const data = JSON.parse(e.target.result as string)
          const result = await importCollection(database, selectedCollection, data)
          console.log("Import result:", result)
        } catch (error) {
          console.error("Import failed:", error)
        }
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-semibold mb-4">Document Viewer/Editor</h2>
      <Input
        type="text"
        placeholder="Collection name"
        value={selectedCollection}
        onChange={(e) => setSelectedCollection(e.target.value)}
        className="mb-4"
      />
      <Editor
        height="300px"
        defaultLanguage="json"
        value={documentContent}
        onChange={(value) => setDocumentContent(value || "")}
      />
      <div className="flex space-x-2 mt-4">
        <Button onClick={() => setOperation("create")}>Create</Button>
        <Button onClick={() => setOperation("update")}>Update</Button>
        <Button onClick={() => setOperation("delete")}>Delete</Button>
        <Button onClick={handleOperation} disabled={!operation}>
          Execute
        </Button>
      </div>
      <div className="flex space-x-2 mt-4">
        <Button onClick={handleExport}>Export</Button>
        <Input type="file" accept=".json" onChange={handleImport} />
      </div>
    </div>
  )
}

