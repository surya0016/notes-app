import { PencilIcon, Pin, Tag, TrashIcon } from 'lucide-react'
import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface NoteCardProps {
  title: string
  description: string
  content: string
  tags: string[]
  onEdit: ()=>void
  onDelete: ()=>void
  onClick: ()=>void
}

const NoteCard = ({
  content,
  description,
  tags,
  title,
  onEdit,
  onDelete,
  onClick
}:NoteCardProps) => {
  return (
    <>
      <div 
      onClick={()=>onClick()}
      className="flex cursor-pointer flex-col border rounded-md w-full px-4 py-4 hover:shadow-xl transition hover:-translate-1.5 z-50">
        <div className="flex justify-between items-center mb-2 pb-2 border-b">
          <div className="font-semibold text-xl truncate">{title}</div>
          <div className="dark:hover:bg-blue-800/20 dark:hover:text-blue-300 hover:text-blue-800 hover:bg-blue-100 rounded-full p-1 cursor-pointer"><Pin size={20}/></div>
        </div>
        <div className="text-sm text-muted-foreground">{description}</div>
        <div className="content line-clamp-4 my-4 min-h-[6rem]">{content}</div>
        <div className="mb-2 gap-4">
          {tags.map((tag, index)=>(
            <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
              <Tag className="h-3 w-3 mr-1" />{tag}
            </Badge>
          ))}
        </div>
        <div className="flex w-full justify-between items-center mb-2">
          <div>
            <Button onClick={()=>onEdit()} className="cursor-pointer dark:hover:bg-green-800/20 dark:hover:text-green-300 hover:bg-green-500/20 hover:text-green-800" variant="outline"><PencilIcon/> Edit</Button>
          </div>
          <div className="">
            <Button onClick={()=>onDelete()} className="cursor-pointer dark:hover:bg-red-800/20 dark:hover:text-red-300 hover:bg-red-500/25 hover:text-red-800" variant="outline"><TrashIcon/> Delete</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default NoteCard