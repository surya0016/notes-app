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

    console.log("USER CREATED SUCCESSFULLY! : -----> ", user)

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

    const notes = await db
      .select({
        note: NotesTable,
        tag: TagsTable,
      })
      .from(NotesTable)
      .leftJoin(NotesTagsTable, eq(NotesTable.id ,NotesTagsTable.noteId))
      .leftJoin(TagsTable, eq(NotesTagsTable.tagId, TagsTable.id))
      .where(eq(NotesTable.userId, userId))
    
    const groupedNotes:any = {};

    for (const f_note of notes){
      const noteId = f_note.note.id
      if(!groupedNotes[noteId]){
        groupedNotes[noteId] ={
          ...f_note.note,
          tags:[]
        }          
      }
      if(f_note.tag){
        groupedNotes[noteId].tags.push(f_note.tag)
      }
    }

    console.log("NOTES: ",groupedNotes)
    return {
      notes:groupedNotes,
      message:"NOTES RETREIVED SUCCESSFULLY!"
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
// UPDATE NOTE FUNCTION
// DELETE NOTE FUNCTION
// GET A SINGLE NOTE FUNCTION
