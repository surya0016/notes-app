"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type Note = {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

type HistoryEntry = {
  id: string
  noteId: string
  title: string
  content: string
  tags: string[]
  timestamp: Date
  action: "created" | "updated" | "deleted"
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("notes")

  // Form state
  const [isOpen, setIsOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])

  // Load notes and history from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    const savedHistory = localStorage.getItem("notesHistory")

    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes)
        // Convert string dates back to Date objects
        setNotes(
          parsedNotes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          })),
        )
      } catch (e) {
        console.error("Failed to parse saved notes", e)
      }
    }

    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(
          parsedHistory.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          })),
        )
      } catch (e) {
        console.error("Failed to parse saved history", e)
      }
    }
  }, [])

  // Save notes and history to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem("notesHistory", JSON.stringify(history))
  }, [history])

  const addToHistory = (note: Note, action: "created" | "updated" | "deleted") => {
    const historyEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      noteId: note.id,
      title: note.title,
      content: note.content,
      tags: [...note.tags],
      timestamp: new Date(),
      action,
    }

    setHistory((prev) => [historyEntry, ...prev])
  }

  const handleCreateNote = () => {
    if (!title.trim()) return

    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setNotes((prev) => [newNote, ...prev])
    addToHistory(newNote, "created")
    resetForm()
    setIsOpen(false)
  }

  const handleUpdateNote = () => {
    if (!editingNote || !title.trim()) return

    const updatedNote: Note = {
      ...editingNote,
      title,
      content,
      tags,
      updatedAt: new Date(),
    }

    setNotes((prev) => prev.map((note) => (note.id === editingNote.id ? updatedNote : note)))

    addToHistory(updatedNote, "updated")
    resetForm()
    setIsOpen(false)
  }

  const handleDeleteNote = (id: string) => {
    const noteToDelete = notes.find((note) => note.id === id)
    if (!noteToDelete) return

    setNotes((prev) => prev.filter((note) => note.id !== id))
    addToHistory(noteToDelete, "deleted")
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setTags([...note.tags])
    setIsOpen(true)
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setTags([])
    setTagInput("")
    setEditingNote(null)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const filteredNotes = notes.filter((note) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Notes App</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open)
                if (!open) resetForm()
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>{editingNote ? "Edit Note" : "Create Note"}</DialogTitle>
                  <DialogDescription>
                    {editingNote ? "Make changes to your note here." : "Add a new note to your collection."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Note title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your note here..."
                      className="min-h-[150px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTag} variant="secondary">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setIsOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={editingNote ? handleUpdateNote : handleCreateNote}>
                    {editingNote ? "Save Changes" : "Create Note"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="notes" className="mt-0">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery ? (
                <p className="text-muted-foreground">No notes match your search.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-muted-foreground">You don't have any notes yet.</p>
                  <Button onClick={() => setIsOpen(true)}>Create your first note</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl truncate">{note.title}</CardTitle>
                    <CardDescription className="text-xs">Updated {formatDate(note.updatedAt)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm line-clamp-3">{note.content}</p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(note)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteNote(note.id)}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No history yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <CardDescription className="text-xs">{formatDate(entry.timestamp)}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          entry.action === "created"
                            ? "default"
                            : entry.action === "updated"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2">{entry.content}</p>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
