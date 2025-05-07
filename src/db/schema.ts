import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helper";

export const NotesTable = pgTable("notes",{
  id: t.uuid("id").primaryKey().defaultRandom(),
  title: t.varchar("title",{length:255}).notNull(),
  content: t.varchar("content",{length:255}).notNull(),
  tags: t.varchar("tags",{length:255}).array().notNull(),
  ...timestamps
})