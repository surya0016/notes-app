import 'dotenv/config';
import { NotesTable, NotesTagsTable, TagsTable, UserTable } from '@/db/schema';
import { db } from '@/db';
import { eq, inArray } from 'drizzle-orm';

// check if the user already exists ? user already exists : create a new user
interface CreateUserProps {
  name: string,
  email: string,
  password: string,
}

export const createUser = async({name, email, password}:CreateUserProps) => {
  try {
    const userAlreadyExists = await db.query.UserTable.findFirst({
      where: ((user, {eq}) => eq(user.email, email))
    })
    if(userAlreadyExists){
      console.log("USER ALREADY EXISTS")
      return {
        message: "User already exists"
      }
    }
    
    const normalizedEmail = email.toLowerCase().trim()

    const user = await db.insert(UserTable).values({
      name,
      email:normalizedEmail,
      password
    }).returning()

    console.log("USER CREATED SUCCESSFULLY! ")

    return {
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email
      },
      message: "User created successfully!"
    }
  } catch (error) {
    console.log("ERROR [CREATE_USER]: ", error)
    return {
      message: "Server Error [CREATE_USER_FUNC]"
    }
  }    
}

// Add a note to a user with tags 
  interface CreateNoteProps {
    userId: string,
    title: string,
    content: string,
    tags: string[],
  }

export const createNote = async({
  userId,
  title,
  content,
  tags
}:CreateNoteProps) => { 
  try {
    // note will return array like: [{title:"",contetn:"",id:""}] so we destructured it 
    // [note] will grab the first element in the array
    const [note] = await db.insert(NotesTable).values({
      title,
      content,
      userId,
    }).returning()

    // Checking if tags are empty
    if (tags.length > 0){
      // Inserting every array form this tags array one by one
      for (const tag of tags){
        await db.
          insert(TagsTable).
          values({name: tag}).
          onConflictDoNothing()
        // console.log(tag)
      }

      // Getting the tags id and name from the database. 
      const tagIds = await db.select().from(TagsTable

      ).where(inArray(TagsTable.name, tags))
      
      // Inserting noteId and the tagId in NotesTagsTable 
      await db.insert(NotesTagsTable).values(
        tagIds.map(tag => ({
          noteId:note.id,
          tagId: tag.id
        }))
      )
    }

      console.log("NOTE CREATED SUCCESSFULLY!")
      
      return {
        note,
        message:"NOTE CREATED SUCCESSFULLY!"
      };

    } catch (error) {
      console.log("ERROR [CREATE_NOTE_FUNC]: ",error)
      return {
        message:"Server Error [CREATE_NOTE_FUNC]"
      }
    }
}

export const getAllNote = async({userId}:{userId:string}) => {
  try {
    //Select notes with joints for a particular user
    const notes = await db
      .select({
        note: NotesTable,
        tag: TagsTable,
      })
      .from(NotesTable)
      .leftJoin(NotesTagsTable, eq(NotesTable.id ,NotesTagsTable.noteId))
      .leftJoin(TagsTable, eq(NotesTagsTable.tagId, TagsTable.id))
      .where(eq(NotesTable.userId, userId))
    
    //Giving type for Fetched notes
    type FetchedNote = typeof NotesTable.$inferSelect & { tags: typeof TagsTable.$inferSelect[] }

    //Creating a object to store all the grouped notes
    //Why grouped notes? the above function will give notes for every tags, 
    //which means that same notes with different tags will be reapeted 
    //for ex:
    // [
    //   { note: { id: 1, title: "Note A" }, tag: { id: 101, name: "tag1" } },
    //   { note: { id: 1, title: "Note A" }, tag: { id: 102, name: "tag2" } },
    //   { note: { id: 2, title: "Note B" }, tag: { id: 103, name: "tag3" } },
    // ]
    const groupedNotes: Record<string, FetchedNote> = {};

    //Adding the notes to grouped notes with their note id and creating tags array for every notes
    for (const row of notes){
      const noteId = row.note.id
      //If there is no grouped notes with this id add it and add tags array
      if(!groupedNotes[noteId]){
        groupedNotes[noteId] ={
          ...row.note,
          tags:[]
        }          
      }
      if(row.tag){
        groupedNotes[noteId].tags.push(row.tag)
      }
    }

    return {
      //Returning groupedNotes as an array 
      notes: Object.values(groupedNotes),
      message: "..."
    }
  } catch (error) {
    console.log("ERROR [GET_ALL_NOTES_FUNC]", error)
    return {
      message:"Server Error [GET_ALL_NOTES_FUNC]"
    }
  }
}

export const deleteDB = async() => {
  await db.delete(NotesTable)
  await db.delete(UserTable)
  await db.delete(NotesTagsTable)
  await db.delete(TagsTable)
}

// CREATE USER FUNCTION ✔
// CREATE NOTE FUNCTION ✔
// GET ALL NOTE FUNCTION ✔
// UPDATE A NOTE FUNCTION
// DELETE A NOTE FUNCTION
// GET A SINGLE NOTE FUNCTION
