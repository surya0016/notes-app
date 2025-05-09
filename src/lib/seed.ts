import 'dotenv/config';
import { getAllNote } from '@/db/queries/note';

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

  const {notes} = await getAllNote({
    userId: "075ad37b-b675-4271-9594-a06f11b5a4a9"
  })

  notes?.map((note)=>{
    const tags = note.tags
    tags.map((tag)=>{
      console.log(tag)
    })
  })

  // userid1:"075ad37b-b675-4271-9594-a06f11b5a4a9"
  // userid2:"42966a38-0f4e-416a-b7d0-185f51a82e4d"
  // await deleteDB()
}

main();

// CREATE USER FUNCTION ✔
// CREATE NOTE FUNCTION ✔
// GET ALL NOTE FUNCTION ✔
// UPDATE A NOTE FUNCTION
// DELETE A NOTE FUNCTION
// GET A SINGLE NOTE FUNCTION