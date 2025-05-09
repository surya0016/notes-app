"use client"

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search} from "lucide-react";
import { notes1 } from "@/lib/data";
import NoteCard from "@/components/note-card";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/darkmode-toggle";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)

  const handlePreview = () => {
    setIsPreviewOpen(true)
  }

  const handleEdit = () => {
    setIsOpen(true)
  }

  const handleDelete = () => {

  }
  return (
    <>
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="mb-6 flex flex-row justify-between items-center">
          <div className="font-bold text-3xl">Notes App</div>
          <div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <Tabs defaultValue="notes" className="w-full rounded-xs">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <div className="flex flex-row gap-2">
              <ModeToggle/>
              <span>
                <form action="">
                  <div className="border px-2 py-1.5 rounded-lg flex flex-row justify-center items-center">
                    <Search className="h-4 w-4 text-muted-foreground mr-2" />
                    <input type="text" className="outline-none" placeholder="Search"/>
                  </div>
                </form>
              </span>
              <span>
                <Dialog 
                  open={isOpen}
                  onOpenChange={(open) => {
                    setIsOpen(open)
                  }} 
                >
                  <DialogTrigger asChild><Button><Plus/> New Note</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Note</DialogTitle>
                      <DialogDescription>
                        Make changes to your note here.
                      </DialogDescription>
                    </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col">
                          <Label htmlFor="title" className="text-right mb-2">
                            Title
                          </Label>
                          <Input id="title" className="col-span-3" />
                        </div>
                        <div className="flex flex-col">
                          <Label htmlFor="content" className="text-right mb-2">
                            Content
                          </Label>
                          <Textarea id="content" className="col-span-3 min-h-52"/>
                        </div>
                        <div className="flex flex-col">
                          <Label htmlFor="tags" className="text-right mb-2">
                            Tags
                          </Label>
                          <div className="flex justify-between items-center">
                            <Input id="tags" className="col-span-3 mr-2" />
                            <Button variant="secondary">Add</Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Button variant="secondary" className="">Cancel</Button>
                          <Button className="">Save Changes</Button>
                        </div>
                      </div>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={isPreviewOpen}
                  onOpenChange={(open) => {
                    setIsPreviewOpen(open)
                  }}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </span>
            </div>
          </div>

          <TabsContent value="notes">
            <div className="grid grid-cols-3 gap-4">
              {notes1.map((note,index)=>(
                <NoteCard onClick={handlePreview} onEdit={handleEdit} onDelete={handleDelete} key={index} title={note.title} description={note.description} content={note.content} tags={note.tags}/>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="history">Change your password here.</TabsContent>
        </Tabs>

      </div>
    </>
  );
}
