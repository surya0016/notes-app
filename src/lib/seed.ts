import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { NotesTable, NotesTagsTable, TagsTable, UserTable } from '@/db/schema';
import { db } from '@/db';
import { notes2 } from './data';
import { createNote, createUser, deleteDB, getAllNote } from './db';

async function main() {
  {// const user1 = await createUser({
  //   name: "Hari",
  //   email: "hari@test.com",
  //   password: "1234"
  // })
  // const user2 = await createUser({
  //   name: "Surya",
  //   email: "surya@test.com",
  //   password: "1234"
  // })

  // const users = await db.query.UserTable.findMany()

  // notes2.map((note)=>{
  //   createNote({
  //     content:note.content,
  //     title:note.title,
  //     tags:note.tags,
  //     userId: users[1].id
  //   })
  // })
  }

  await getAllNote({
    userId: "075ad37b-b675-4271-9594-a06f11b5a4a9"
  })

  // userid1:"075ad37b-b675-4271-9594-a06f11b5a4a9"
  // userid2:"42966a38-0f4e-416a-b7d0-185f51a82e4d"
  // await deleteDB()
}

main();
