"use client"

import { useState } from "react"
import { Edit2, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Editor } from "@monaco-editor/react"

interface DocumentCardProps {
  document: any
  onEdit: (doc: any) => void
  onDelete: (id: string) => void
}

export function DocumentCard({ document, onEdit, onDelete }: DocumentCardProps) {
  const [showJson, setShowJson] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(JSON.stringify(document, null, 2))

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editedContent)
      onEdit(parsed)
      setIsEditing(false)
    } catch (error) {
      console.error("Invalid JSON:", error)
    }
  }

  return (
    <>
      <Card className="group relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Document ID:{" "}
            {typeof document._id === "string"
              ? document._id.substring(0, 8)
              : (document._id?.toString() || "N/A").substring(0, 8)}
            ...
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowJson(true)}>
                <Eye className="mr-2 h-4 w-4" />
                View JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(document._id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <CardDescription className="truncate">
            {Object.entries(document)
              .filter(([key]) => key !== "_id")
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </CardDescription>
        </CardContent>
      </Card>

      <Dialog open={showJson} onOpenChange={setShowJson}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Document JSON</DialogTitle>
            <DialogDescription>View the complete JSON structure of this document.</DialogDescription>
          </DialogHeader>
          <div className="h-[400px] rounded-md border">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={JSON.stringify(document, null, 2)}
              options={{ readOnly: true }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>Make changes to the document JSON and save.</DialogDescription>
          </DialogHeader>
          <div className="h-[400px] rounded-md border">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={editedContent}
              onChange={(value) => setEditedContent(value || "")}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

