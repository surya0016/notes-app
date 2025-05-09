import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core"

export const UserTable = pgTable("users", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  name: t.varchar("name", { length: 255 }).notNull(),
  email: t.varchar("email", { length: 255 }).notNull().unique(),
  password: t.varchar("password", { length: 255 }).notNull(),
  updated_at: t.timestamp({mode:"date"}).defaultNow(),
  created_at: t.timestamp({mode:"date"}).defaultNow().notNull(),
})

export const NotesTable = pgTable("notes",{
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t.uuid("userId").references(()=>UserTable.id, { onDelete: "cascade" }).notNull(),
  title: t.varchar("title",{length:255}).notNull(),
  content: t.text("content").notNull(),
  updated_at: t.timestamp({mode:"date"}).defaultNow(),
  created_at: t.timestamp({mode:"date"}).defaultNow().notNull(),
})

export const TagsTable = pgTable("tags",{
  id: t.integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  name: t.varchar("name",{ length:255 }).notNull()
})

export const NotesTagsTable = pgTable("notesTags", {
  noteId: t.uuid("noteId").references(()=>NotesTable.id, { onDelete: "cascade" }).notNull(),
  tagId: t.integer("tagId").references(()=>TagsTable.id, { onDelete: "cascade" }).notNull(),
}, table => {
  return {
    pk: t.primaryKey({columns: [table.noteId, table.tagId]})   // Creating a unique id for the joint table which will
  }                                                            // be the combination of these two 
})
