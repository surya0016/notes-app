import 'dotenv/config';
import { NotesTable, NotesTagsTable, TagsTable, UserTable } from '@/db/schema';
import { db } from '@/db';

export const deleteDB = async() => {
  await db.delete(NotesTable)
  await db.delete(UserTable)
  await db.delete(NotesTagsTable)
  await db.delete(TagsTable)
}